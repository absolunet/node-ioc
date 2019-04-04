//--------------------------------------------------------
//-- Node IoC - Support - Proxy - Base Proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');


class BaseProxy {

	/**
	 * ConnectorProxy constructor.
	 */
	constructor() {
		__(this).set('has', (obj, prop) => {
			const inPrototype = Object.prototype.hasOwnProperty.call(obj.constructor.prototype, prop);
			const inInstance = Object.prototype.hasOwnProperty.call(obj, prop);

			return inPrototype || inInstance || Boolean(obj[prop]);
		});
	}

	/**
	 * Connector property accessor.
	 *
	 * @param {Connector} obj
	 * @param {string} prop
	 * @returns {*}
	 */
	get(obj, prop) {
		if (prop === '__instance') {
			return obj;
		}

		if (__(this).get('has')(obj, prop)) {
			const value = obj[prop];

			if (typeof value === 'function') {
				return value.bind(obj);
			}

			return value;
		}

		if (typeof prop === 'symbol') {
			return obj[prop];
		}

		return undefined;
	}

}

module.exports = BaseProxy;
