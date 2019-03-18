//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Mapping proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');


class MappingProxy {

	/**
	 * MappingProxy constructor.
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
	 * @param {Model} obj
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

		return typeof prop === 'symbol' ? obj[prop] : obj.getAttribute(prop);
	}

	/**
	 * Mapper property mutator.
	 *
	 * @param {Model} obj
	 * @param {string} prop
	 * @param {*} value
	 * @returns {boolean}
	 */
	set(obj, prop, value) {
		obj.setAttribute(prop, value);

		return true;
	}

	/**
	 * Mapper property check handler.
	 *
	 * @param {Container} obj
	 * @param {string} prop
	 * @returns {boolean}
	 */
	has(obj, prop) {
		return __(this).get('has')(obj, prop) || typeof obj.getAttributes()[prop] !== 'undefined';
	}

}

module.exports = MappingProxy;
