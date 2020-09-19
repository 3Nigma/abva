const { BaseIntent } = require('../core/intent');

class RootFlow extends BaseIntent {
    static get name() {
        return 'Welcome Intent';
    }

    constructor() {
        super(RootFlow.name);
    }
}

module.exports = {
    RootFlow
};