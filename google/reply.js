const { Confirmation } = require('actions-on-google');

const { BaseReply } = require('../core/reply');
const { VoicePendings } = require('../core/context');

class PendingQuestionResponse {
    constructor(replier, question) {
        this._replier = replier;
        this._question = question || '';
    }

    get question() {
        return this._question;
    }
    get isWaitingToBeResolved() {
        return this._waitingToBeResolved;
    }

    bindToConvAndResolver(conv, remoteIntentResolver) {
        this.resolveWith = this._resolveWith.bind(this, conv, remoteIntentResolver);
    }

    waitForResponse() {
        this._waitingToBeResolved = true;
        // No need to bind to the current conversation because the response itself cannot be resolved during the same execution
        return new Promise((accept, _) => { this._promiseResolver = accept; });
    }

    /**
     * @private
     */
    _resolveWith(conv, remoteIntentResolver, passThroughArg) {
        // Update reply instance variables
        this._replier._currentConversation = conv;
        this._replier._remotelyResolveIntent = remoteIntentResolver;

        this._waitingToBeResolved = false;
        return this._promiseResolver(passThroughArg);
    }

    /**
     * @abstract
     */
    get definition() {
        throw new Error("This pending-response instance doesn't have an associated definition attached.");
    }
}

class DialogFlowConfirmationPendingResponse extends PendingQuestionResponse {
    /**
     * 
     * @param {*} replier 
     * @param {string} textQuestion - the question to ask, does not accept SSML
     */
    constructor(replier, textQuestion) {
        super(replier, textQuestion);

        replier.askFor(new Confirmation(textQuestion));
        replier.send();
    }

    get definition() {
        return VoicePendings.Confirmation;
    }
}

class DialogFlowReply extends BaseReply {
    constructor(backend, vContext) {
        super(backend);
        this._context = vContext;
    }

    bindToConvHandler(conv, remoteIntentResolver) {
        this._currentConversation = conv;
        this._remotelyResolveIntent = remoteIntentResolver;

        // Rebind all pendings to current conversation & handler
        Object.keys(this._context.pendings)
            .filter(replyPending => this._context.pendings[replyPending])
            .forEach(validReplyPending => this._context.pendings[validReplyPending].bindToConvAndResolver(conv, remoteIntentResolver));
    }

    with(...statements) {
        this.askFor(...statements);
    }
    endingWith(...statements) {
        this._currentConversation.close(...this._tryWrapSSMLWithSpeakTagsFor(...statements));
    }
    askFor(...what) {
        this._currentConversation.ask(...this._tryWrapSSMLWithSpeakTagsFor(...what));
    }

    async askingForConfirmationTo(text) {
        this._context.pendings.confirmation = new DialogFlowConfirmationPendingResponse(this, text);
        return this._context.pendings.confirmation.waitForResponse();
    }


    send() {
        this._remotelyResolveIntent();
    }
}

module.exports = {
    DialogFlowReply
};