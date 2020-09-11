const { BaseIntent } = require('../core/intent');

class FallbackIntent extends BaseIntent {
    static get name() {
        return 'actions.intent.FALLBACK';
    }

    constructor() {
        super(FallbackIntent.name);
    }

    /**
     * @override
     */
    async _handleFor(channel, context, request, reply) {
        reply.with(`I couldn't undestand what you were saying. Can you please say it again?`);
    }
}

module.exports = {
    FallbackIntent
};