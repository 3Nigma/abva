class VoiceBackend {
    constructor(name) {
        this._name = name;
        this._channel = {
            name: this._name.toLowerCase(),
            _do: async (conv, channelClb) => await channelClb[`visit${name}`](conv)
        };  // TODO: classify this
        this._vContexts = {};
    }

    /**
     * @abstract
     */
    get _appRoute() {
        throw new Error("App route is not specified. Don't know what to mount!");
    }

    /**
     * Registers the backend to be sensitive to the following intents.
     * 
     * @param  {...object} intentClasses 
     */
    register(...intentClasses) {
        throw new Error("Please implement a way to 'register' to the provided intents classes.");
    }

    mountTo(eApp, path) {
        eApp.post(path, this._appRoute);
    }
}

module.exports = {
    VoiceBackend
};