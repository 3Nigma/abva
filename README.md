# A.B.V.A.
A Better Voice API for the masses; a DialogFlow use-case.

Proof of concept code that helps you write chat-bot controlling logic in a more simple, elegant and frictionless manner. It was [initially written to support a medium article](https://medium.com/@victor.adascalitei/rest-is-bad-for-dialogue-a-critique-on-conversation-apis-40fbff7e792d), but has since grown up a bit on features. Currently, the following "utility" intents are supported:
* yes/no confirmation questions
* integer number selection questions
* location permissions

Here's a flavour of how you can cascade 2 yes/no questions taken from the [Human or Robot flow](https://github.com/3Nigma/abva/blob/master/flows/human-or-robot.js):
``` js
if (await reply.askingForConfirmationTo("In order to continue, please say 'yes' if you are a human or 'no' otherwise.")) {
  reply.endingWith("Perfect! That's all I wanted to hear.");
} else if (await reply.askingForConfirmationTo("Are you positive? I'm not going to ask a third time.")) {
  reply.endingWith("Alright then. I'm sorry, but I'm only currently programmed to assist human beings.");
} else {
  reply.endingWith("Ok. That's what I also thought.");
}
```

To make this example work for you, you will need to [create a DialogFlow agent](https://dialogflow.cloud.google.com/#/newAgent), [import the intents](https://www.dropbox.com/s/gtmo5gwdj13wih3/mcchatty-v2.zip?dl=0), [install ngrok](https://ngrok.com/) and fire up the code ([node.js](https://nodejs.org/en/) is also required):
```
$ npm install
$ npm run human-or-robot:example
$ ngrok http 3000
```
With ngrok started, just copy-paste the publickly facing address to your agent's fulfilment uri.

For more sophisticated runs, there are 2 more examples present in the `flows` directory:
* a number guessing game _and_
``` js
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
```
* a simple location-permission asker
``` js
const userLocation = await reply.askingForCurrentLocation();

if (userLocation !== undefined) {
    reply.endingWith(`Thank you. I've pinpointed your longitude and latitude location.`);
} else {
    reply.endingWith(`Ok. I won't use your location then.`);
}
```
To run them you would need to follow the same above-mentioned steps with the addition that you
# have to [import this, more complete, agent description](https://www.dropbox.com/s/a1i9y3zayst9cxu/mcchatty-v3.zip?dl=0) into DialogFlow
# execute `npm run ask-location:example` or `npm run guess-number:example` depending on what you want to see