const { VoicePendings } = require('../../core/context');
const { BaseUtilityIntent } = require('./base_utility');

class NumberIntent extends BaseUtilityIntent {
    static get name() {
        return 'actions.intent.NUMBER';
    }

    constructor() {
        super([VoicePendings.NumberSelection], NumberIntent.name);
    }

    /**
     * @override
     */
    async handleFor(channel, context, request, reply) {
        const providedNumber = parseInt(request.argument);

        return context.pendings.numberSelection.resolveWith(providedNumber);
    }
}

module.exports = {
    NumberIntent
};