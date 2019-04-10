//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const factory = require('./concerns/mixinFactory');


module.exports = factory((SuperClass) => {

	return class ForwardCalls extends SuperClass {

		forwardCall(method, args) {
			const forward = this.getForward();

			return forward[method](...args);
		}

		getForward() {
			throw new TypeError('Method getForward() must be implemented. It should return an object.');
		}

	};

});
