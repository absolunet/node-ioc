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
		__(this).set('has', (object, property) => {
			const inPrototype = Object.prototype.hasOwnProperty.call(object.constructor.prototype, property);
			const inInstance  = Object.prototype.hasOwnProperty.call(object, property);

			return inPrototype || inInstance || Boolean(object[property]);
		});
	}

	/**
	 * Connector property accessor.
	 *
	 * @param {Connector} object
	 * @param {string} property
	 * @returns {*}
	 */
	get(object, property) {
		if (property === '__instance') {
			return object;
		}

		if (__(this).get('has')(object, property)) {
			const value = object[property];

			if (typeof value === 'function') {
				return value.bind(object);
			}

			return value;
		}

		if (typeof property === 'symbol') {
			return object[property];
		}

		return undefined;
	}

}


module.exports = BaseProxy;
