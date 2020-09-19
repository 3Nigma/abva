const { RootFlow } = require('./root_flow');

class GuessNumberRootFlow extends RootFlow {
    /**
     * @override
     */
    async _handleFor(channel, context, request, reply) {
        let numberToGuess = Math.floor(Math.random() * Math.floor(20));
        let guessedNumber;
        let hintText;

        reply.with("Let's play a game! I'm thinking of a number between 0 and 20.");
        guessedNumber = await reply.askingForNumberedSelectionTo("What do you think it is?");
        while (numberToGuess !== guessedNumber) {
            if (guessedNumber < numberToGuess) {
                hintText = "It's higher then that.";
            } else {
                hintText = "It's lower then that.";
            }
            reply.with(`${hintText} Try again.`);
            guessedNumber = await reply.askingForNumberedSelectionTo("What do you think my number is?");
        }
        if (numberToGuess === guessedNumber) {
            reply.endingWith(`Congratulations, you nailed it! It was indeed ${numberToGuess}.`);
        } else {
            reply.endingWith("TODO: User cancelled game, now what?");
        }
    }
}

module.exports = {
    GuessNumberRootFlow
};