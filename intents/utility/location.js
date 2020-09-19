const { VoicePendings } = require('../../core/context');
const { BaseUtilityIntent } = require('./base_utility');

class LocationIntent extends BaseUtilityIntent {
    static get name() {
        return 'actions.intent.LOCATION';
    }

    constructor() {
        super([VoicePendings.Location], LocationIntent.name);
    }

    /**
     * @override
     */
    async handleFor(channel, context, request, reply) {
        const wasItGranted = request.argument;

        if (wasItGranted === true) {
            channel.do({
                visitDialogFlow: (conv) => {
                    context.setDeviceLocationTo(conv.device.location.coordinates);
                }
            });
        }
        return context.pendings.location.resolveWith(context.getDeviceLocation());
    }
}

module.exports = {
    LocationIntent
};