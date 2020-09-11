const { dialogflow } = require('actions-on-google');

const { BaseIntent } = require('../core/intent');
const { BaseUtilityIntent } = require('../intents/utility/base_utility');
const { VoiceBackend } = require('../core/backend');
const { VoiceContext } = require('../core/context');
const { DialogFlowReply } = require('./reply');

class DialogFlowBackend extends VoiceBackend {
    constructor(opts) {
        super('DialogFlow');

        this._opts = Object.assign({
            debug: false
        }, opts);
        this._app = dialogflow({ debug: this._opts.debug });
        this._intentHandlers = {};
        this._utilityIntentHandlers = {};

        // TODO: Tie-in both error and fallback handlers ?
    }

    /**
     * @implements
     */
    register(...intentClasses) {
        // Make sure the passed-in arguments are all Intents
        const intentDefinitions = intentClasses.filter(intentClass => {
            const isIntentClass = BaseIntent.isPrototypeOf(intentClass);

            if (isIntentClass === false) {
                console.warn(`Discarding backend-provided register argument because it's not extending BaseIntent.`);
            }
            return isIntentClass;
        }).map(intentClass => new intentClass(this._opts));

        // Keep a hold on all the provided utility intent definitions
        intentDefinitions.forEach(intentDefinition => {
            this._intentHandlers[intentDefinition.name] = intentDefinition;
            if ((intentDefinition instanceof BaseUtilityIntent) === true) {
                this._utilityIntentHandlers[intentDefinition.name] = intentDefinition;
            }
        });

        intentDefinitions.forEach(intentDefinition => {
            this._app.intent(intentDefinition.voiceTriggerNames, (conv, params, argument, status) => {
                return new Promise(async (accept, _) => {
                    // Make sure we have a sane context
                    if (this._vContexts[conv.id] === undefined) {
                        this._vContexts[conv.id] = new VoiceContext();
                    }
                    conv.reply = new DialogFlowReply(this, this._vContexts[conv.id]);

                    // Prepare the replier
                    conv.reply.bindToConvHandler(conv, accept);
                    this._channel.do = this._channel._do.bind(this, conv);

                    // see https://actions-on-google.github.io/actions-on-google-nodejs/interfaces/dialogflow.dialogflowapp.html#intent
                    const context = this._vContexts[conv.id];
                    const request = { params, argument, status };  // TODO: classify this
                    const reply = conv.reply;
                    
                    // Note: Handoffs don't need to be checked because they close the session when confirmed
                    const pendingUtilityNameToBeResolved = Object.keys(this._utilityIntentHandlers)
                        .find(utilityIntentHandlerName => this._utilityIntentHandlers[utilityIntentHandlerName].targetedPendingDefinitions
                        .find(checkedTargetedPendingDefinition => reply._context.pendings[checkedTargetedPendingDefinition.name] && reply._context.pendings[checkedTargetedPendingDefinition.name].isWaitingToBeResolved) !== undefined);

                    if (pendingUtilityNameToBeResolved !== undefined) {
                        const utilityIntentHandler = this._utilityIntentHandlers[pendingUtilityNameToBeResolved];

                        await utilityIntentHandler.handleFor(this._channel, context, request, reply);
                    } else {
                        // Default to try and handle the intent
                        if (await intentDefinition.canHandle(this._channel, context, request, reply) === true) {
                            await intentDefinition.handleFor(this._channel, context, request, reply);
                        }
                    }
                });
            });
        });
    }

    /**
     * @implements
     */
    get _appRoute() {
        return this._app;
    }
}

module.exports = {
    DialogFlowBackend
};