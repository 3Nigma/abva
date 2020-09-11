class BaseIntent {
    constructor(name, triggerNames, flushIfNotHandling) {
        this._name = name;
        this._triggerNames = triggerNames;
        this._flushIfNotHandling = flushIfNotHandling === undefined ? true : flushIfNotHandling;

        if (this._triggerNames === undefined) {
            this._triggerNames = [this._name];
        }
    }

    get name() {
        return this._name;
    }
    get voiceTriggerNames() {
        return this._triggerNames;
    }

    async canHandle(channel, context, request, reply) {
        let canIt = true;

        try {
            canIt = await this._canHandle(channel, context, request, reply);
            if (this._flushIfNotHandling === true && canIt === false) {
                // Just flush the replier
                reply.send();
            }
        } catch (err) {
            console.error(`core/intent.js/BaseIntent/canHandle reported an error: \n${err.stack}`);
            reply.send();
            canIt = false;
        } finally {
            // Don't reply.send here because it will end the response also for handleFor if no error occured
        }
        return canIt;
    }

    async handleFor(channel, context, request, reply) {
        let handleForResult;

        try {
            handleForResult = await this._handleFor(channel, context, request, reply);
        } catch (err) {
            console.error(`core/intent.js/BaseIntent/handleFor reported an error: \n${err.stack}`);
        } finally {
            reply.send();
        }
        return handleForResult;
    }

    /**
     * @abstract
     */
    async _canHandle(channel, context, request, reply) {
        return true;
    }

    /**
     * @abstract
     */
    _handleFor(channel, context, request, reply) {
        throw new Error(`I don't know how to _handle the ${this._name} intent.`);
    }
}

module.exports = {
    BaseIntent
};