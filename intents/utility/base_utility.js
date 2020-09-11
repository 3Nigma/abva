const { BaseIntent } = require('../../core/intent');

class BaseUtilityIntent extends BaseIntent {
    constructor(targetedPendings, humanName, triggerNames) {
        super(humanName, triggerNames, false);
        this._pendings = targetedPendings;
    }

    get targetedPendingDefinitions() {
        return this._pendings;
    }

    /**
     * @override
     */
    async handleFor(channel, context, request, reply) {
        const passThroughArg = request.argument;

        if (passThroughArg === undefined) {
            // Another intent was triggered while current one was waiting a pending-response resolution
            const targetedPending = this._getFirstActiveTargetedPending(context);
            const repromptTextToReplyWith = this._getRepromptTextFor(targetedPending, passThroughArg);

            reply.with(repromptTextToReplyWith);
            reply.send();
        } else {
            await this._tryResolvePendingsWith(context, reply, passThroughArg);
        }
    }

    /**
     * @protected
     */
    _getRepromptForFailedResolutionTo(targetedPending, passThroughArg) {
        return "I couldn't get that.";
    }

    /**
     * @protected
     */
    async _tryResolvePendingsWith(context, reply, passThroughArgument) {
        if (Array.isArray(this._pendings) === false) {
            throw new Error(`Utility intent '${this._name}' has no valid registered pendings to resolve.`);
        }

        const targetedPending = this._getFirstActiveTargetedPending(context);

        if (targetedPending !== null) {
            if (targetedPending.definition.canResolveWith(passThroughArgument) === true) {
                await targetedPending.resolveWith(passThroughArgument);
            } else {
                reply.with(this._getRepromptTextFor(targetedPending, passThroughArgument));
                reply.send();
            }
        }
    }

    /**
     * @private
     */
    _getRepromptTextFor(targetedPending, passThroughArgument) {
        return `${this._getRepromptForFailedResolutionTo(targetedPending, passThroughArgument)} ${targetedPending.question}`;
    }

    /**
     * @private
     */
    _getFirstActiveTargetedPending(context) {
        let targetedPendingActive = null;
        const targetedPendingEntryDefinition = this._pendings.find(pendingDef => {
            const pendingEntry = context.pendings[pendingDef.name];

            return pendingEntry !== null && pendingEntry.isWaitingToBeResolved === true;
        });
        
        if (targetedPendingEntryDefinition !== undefined) {
            targetedPendingActive = context.pendings[targetedPendingEntryDefinition.name];
        }
        return targetedPendingActive;
    }
}

module.exports = {
    BaseUtilityIntent
};