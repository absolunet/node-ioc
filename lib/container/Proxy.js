//--------------------------------------------------------
//-- Node IoC - Container - Proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');


class ContainerProxy {

	/**
	 * ContainerProxy constructor.
	 */
	constructor() {
		__(this).set('has', (obj, prop) => {
			const inPrototype = Object.prototype.hasOwnProperty.call(obj.constructor.prototype, prop);
			const inInstance = Object.prototype.hasOwnProperty.call(obj, prop);

			return inPrototype || inInstance || Boolean(obj[prop]);
		});
	}

	/**
	 * Container property accessor.
	 *
	 * @param {Container} obj
	 * @param {string} prop
	 * @returns {*}
	 */
	get(obj, prop) {
		if (__(this).get('has')(obj, prop)) {
			const value = obj[prop];

			if (typeof value === 'function') {
				return value.bind(obj);
			}

			return value;
		}

		return typeof prop === 'symbol' ? obj[prop] : obj.make(prop);
	}

	/**
	 * Container property check handler.
	 *
	 * @param {Container} obj
	 * @param {string} prop
	 * @returns {boolean}
	 */
	has(obj, prop) {
		return __(this).get('has')(obj, prop) || Boolean(__(obj).get('bindings')[prop]);
	}

}

module.exports = ContainerProxy;
