//--------------------------------------------------------
//-- Node IoC - Support - Proxy - Base Proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const BaseProxy = require('./BaseProxy');
const forwardCalls = require('./../mixins/forwardCalls');


class ForwardProxy extends forwardCalls(BaseProxy) {


	get(obj, prop) {
		const value = super.get(obj, prop);

		if (typeof value === 'undefined') {
			const forward = __(this).get('has')(obj, 'getForward') ? obj.getForward() : this.getForward(obj);
			const forwardedValue = forward[prop];

			return typeof forwardedValue === 'function' ? forwardedValue.bind(forward) : forwardedValue;
		}

		return value;
	}

}

module.exports = ForwardProxy;
