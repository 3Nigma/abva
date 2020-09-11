const { VoicePendings } = require('../../core/context');
const { BaseUtilityIntent } = require('./base_utility');

class ConfirmationIntent extends BaseUtilityIntent {
    static get name() {
        return 'actions.intent.CONFIRMATION';
    }

    constructor() {
        super([VoicePendings.Confirmation], ConfirmationIntent.name);
    }
}

module.exports = {
    ConfirmationIntent
};