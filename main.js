const express = require('express');
const yargs = require('yargs');

const { DialogFlowBackend } = require('./google/dialogflow');

// Load the utility intents
const { NumberIntent } = require('./intents/utility/number');
const { LocationIntent } = require('./intents/utility/location');
const { FallbackIntent } = require('./intents/fallback');
const { ConfirmationIntent } = require('./intents/utility/confirmation');

const argv = yargs
    .option('port', {
        alias: 'p',
        type: 'number',
        description: 'Port to bind the fulfiller to',
        default: 3000
    })
    .option('flow', {
        alias: 'f',
        type: 'string',
        description: 'The root-flow to load',
        choices: ['human-or-robot', 'guess-number', 'ask-location'],
        demandOption: true
    })
    .argv;

const eApp = express().use(express.json());
const dialogFlowBackend = new DialogFlowBackend({});
const rootFlowToLoad = Object.values(require(`./flows/${argv.flow}`))[0];

dialogFlowBackend.register(
    // Business logic flows
    rootFlowToLoad,
    
    // Utility Intents
    ConfirmationIntent,
    LocationIntent,
    NumberIntent,
    FallbackIntent
);

dialogFlowBackend.mountTo(eApp, '/');
eApp.listen(argv.port, () => {
    console.log(`Server starting listening to voice requests on port ${argv.port}`);
});