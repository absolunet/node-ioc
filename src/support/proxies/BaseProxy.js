//--------------------------------------------------------
//-- Node IoC - Support - Proxies - Base Proxy
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Base proxy handler.
 *
 * @memberof support.proxies
 * @hideconstructor
 */
class BaseProxy {

	/**
	 * ConnectorProxy constructor.
	 */
	constructor() {
		__(this).set('has', (object, property) => {
			const inPrototype = Object.prototype.hasOwnProperty.call(object.constructor.prototype, property);
			const inInstance  = Object.prototype.hasOwnProperty.call(object, property);

			return inPrototype || inInstance || Boolean(object[property]);
		});
	}

	/**
	 * Property accessor.
	 *
	 * @param {object} object - Proxied object.
	 * @param {string} property - The property name.
	 * @returns {*} The property value.
	 */
	get(object, property) {
		if (property === '__instance') {
			return object;
		}

		if (__(this).get('has')(object, property)) {
			const value = object[property];

			if (typeof value === 'function' && property !== 'constructor') {
				return Function.prototype.bind.call(value, object);
			}

			return value;
		}

		if (typeof property === 'symbol') {
			return object[property];
		}

		return undefined;
	}

}


export default BaseProxy;
