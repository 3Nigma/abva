const { RootFlow } = require('./root_flow');

class UserLocationRootFlow extends RootFlow {
    /**
     * @override
     */
    async _handleFor(channel, context, request, reply) {
        const userLocation = await reply.askingForCurrentLocation();

        if (userLocation !== undefined) {
            reply.endingWith(`Thank you. I've pinpointed your longitude and latitude location.`);
        } else {
            reply.endingWith(`Ok. I won't use your location then.`);
        }
    }
}

module.exports = {
    UserLocationRootFlow
};