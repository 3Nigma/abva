class VoicePendingDefinition {
    constructor (name, argValidationClb) {
        this._name = name;
        this._argValidationCallback = argValidationClb;
    }

    get name() {
        return this._name;
    }

    equals(other) {
        let doesIt = false;

        if (other instanceof VoicePendingDefinition && other.name === this.name) {
            doesIt = true;
        }
        return doesIt;
    }

    canResolveWith(arg) {
        let canIt = true;

        if (this._argValidationCallback !== undefined) {
            canIt = this._argValidationCallback(arg);
        }
        return canIt;
    }
}

const VoicePendings = {
    Confirmation: new VoicePendingDefinition('confirmation'),
    Location: new VoicePendingDefinition('location'),
    NumberSelection: new VoicePendingDefinition('numberSelection', (arg) => /\d*/g.test(arg))
};

class VoiceContext {
    constructor() {
        this._data = {};

        // Intialize the pendings
        this._pendings = {};
        Object.values(VoicePendings).forEach(pendingDefinition => {
            this._pendings[pendingDefinition.name] = null;
        });
    }

    get pendings() {
        return this._pendings;
    }

    getDeviceLocation() {
        return this._data.deviceLocation;
    }
    setDeviceLocationTo(loc) {
        this._data.deviceLocation = loc;
    }
}

module.exports = {
    VoiceContext,
    VoicePendings
};