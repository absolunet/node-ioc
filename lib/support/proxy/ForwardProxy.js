//--------------------------------------------------------
//-- Node IoC - Support - Proxy - Base Proxy
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const forwardCalls = require('../mixins/forwardCalls');
const BaseProxy    = require('./BaseProxy');


class ForwardProxy extends forwardCalls(BaseProxy) {

	get(object, property) {
		const value = super.get(object, property);

		if (typeof value === 'undefined' && property !== 'init') {
			const forward = __(this).get('has')(object, 'getForward')
				? object.getForward()
				: this.getForward(object);
			const forwardedValue = forward[property];

			return typeof forwardedValue === 'function' ? forwardedValue.bind(forward) : forwardedValue;
		}

		return value;
	}

}


module.exports = ForwardProxy;
