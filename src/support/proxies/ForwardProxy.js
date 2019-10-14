//--------------------------------------------------------
//-- Node IoC - Support - Proxies - Base Proxy
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const forwardCalls = require('../mixins/forwardCalls');
const BaseProxy    = require('./BaseProxy');


/**
 * Proxy that forwards calls to a forwarded instance if property is not found in the instance.
 *
 * @memberof support.proxies
 * @augments support.mixins.ForwardCalls
 * @augments support.proxies.BaseProxy
 * @hideconstructor
 */
class ForwardProxy extends forwardCalls(BaseProxy) {

	/**
	 * @inheritdoc
	 */
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
