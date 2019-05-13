//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------
'use strict';

const factory = require('./concerns/mixinFactory');


module.exports = factory((SuperClass) => {
	return class ForwardCalls extends SuperClass {

		forwardCall(method, parameters) {
			const forward = this.getForward();

			return forward[method](...parameters);
		}

		getForward() {
			throw new TypeError('Method getForward() must be implemented. It should return an object.');
		}

	};
});
