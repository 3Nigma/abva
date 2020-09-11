const express = require('express');

const { DialogFlowBackend } = require('./google/dialogflow');
const { WelcomeIntent } = require('./intents/welcome');
const { FallbackIntent } = require('./intents/fallback');
const { ConfirmationIntent } = require('./intents/utility/confirmation');

console.log('Locking onto the environment ...');
if (process.env.SERVICE_PORT === undefined) {
    process.env.SERVICE_PORT = 3000;
    console.warn(` * No SERVICE_PORT provided. Defaulting to ${process.env.SERVICE_PORT}`);
} else {
    console.log(` * SERVICE_PORT set and using '${process.env.SERVICE_PORT}'.`);
}
console.log('Done checking the environment.');

const eApp = express().use(express.json());
const dialogFlowBackend = new DialogFlowBackend({});

dialogFlowBackend.register(
    // Business logic intents
    FallbackIntent,
    WelcomeIntent,
    
    // Utility Intents
    ConfirmationIntent
);

dialogFlowBackend.mountTo(eApp, '/');
eApp.listen(process.env.SERVICE_PORT, () => {
    console.log(`Server starting listening to voice requests on port ${process.env.SERVICE_PORT}`);
});