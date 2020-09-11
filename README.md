# A.B.V.A.
A Better Voice API for the masses; a DialogFlow use-case.

Proof of concept code that helps you write chat-bot controlling logic in a more simple, elegant and frictionless manner. Currently, only confirmation (yes/no) questions are supported. Hopefully this is enought to prove it's utility.

[Here's a flavour](https://github.com/3Nigma/abva/blob/master/intents/welcome.js#L15) of how you can cascade 2 yes/no questions:
``` js
if (await conv.ask("In order to continue, please say 'yes' if you are a human or 'no' otherwise.")) {
  conv.say("Perfect! That's all I wanted to hear.");
} else if (await conv.ask("Are you positive? I'm not going to ask a third time.")) {
  conv.say("Alright then. I'm sorry, but I'm only currently programmed to assist human beings.");
} else {
  conv.say("Ok. That's what I also thought.");
}
```

To make this example work for you, you will need to [create a DialogFlow agent](https://dialogflow.cloud.google.com/#/newAgent), [import the intents](https://www.dropbox.com/s/gtmo5gwdj13wih3/mcchatty-v2.zip?dl=0), [install ngrok](https://ngrok.com/) and fire up the code ([node.js](https://nodejs.org/en/) is also required):
```
$ npm install
$ npm start
$ ngrok http 3000
```
With ngrok started, just copy-paste the publickly facing address to your agent's fulfilment uri.
