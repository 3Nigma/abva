class BaseReply {
    constructor(backend) {
        this._backend = backend;
    }

    /**
     * Given a list of statements, look through each and every one of them and wrap those that contain SSML tags into <speak> tags before
     * returning the resulting list back.
     * 
     * @param  {...any} statements - whatever we want to be said
     */
    _tryWrapSSMLWithSpeakTagsFor(...statements) {
        return statements.map(whatToSay => {
            let parsedWhatToSay;

            if (typeof(whatToSay) === "string" && this._areSSMLTagsPresentIn(whatToSay)) {
                parsedWhatToSay = `<speak>${whatToSay}</speak>`;
            } else {
                parsedWhatToSay = whatToSay;
            }
            return parsedWhatToSay;
        });
    }

    /**
     * @param {string} str - String to check for SSML tags 
     * @returns true if {@see str} contains SSML tags and false otherwise
     */
    _areSSMLTagsPresentIn(str) {
        return str && (
            str.indexOf('<say-as') !== -1 || 
            str.indexOf('<audio src=') !== -1 ||
            str.indexOf('<break strength=') !== -1
        );
    }
}

module.exports = {
    BaseReply
};