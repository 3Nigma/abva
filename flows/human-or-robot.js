const { RootFlow } = require('./root_flow');

class HumanOrRobotRootFlow extends RootFlow {
    /**
     * @override
     */
    async _handleFor(channel, context, request, reply) {
        if (await reply.askingForConfirmationTo("In order to continue, please say 'yes' if you are a human or 'no' otherwise.")) {
            reply.endingWith("Perfect! That's all I wanted to hear.");
        } else if (await reply.askingForConfirmationTo("Are you positive? I'm not going to ask a third time.")) {
            reply.endingWith("Alright then. I'm sorry, but I'm only currently programmed to assist human beings.");
        } else {
            reply.endingWith("Ok. That's what I also thought.");
        }
    }
}

module.exports = {
    HumanOrRobotRootFlow
};