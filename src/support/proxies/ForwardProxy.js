//--------------------------------------------------------
//-- Node IoC - Support - Proxies - Base Proxy
//--------------------------------------------------------

import __           from '@absolunet/private-registry';
import forwardCalls from '../mixins/forwardCalls';
import BaseProxy    from './BaseProxy';


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


export default ForwardProxy;