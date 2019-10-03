//--------------------------------------------------------
//-- Node IoC - Support - Enums
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Enum {

	/**
	 * Enum constructor.
	 *
	 * Create dynamic properties reversing the enumerated keys and values.
	 * An enum listing foo => bar would exposes "foo" => "bar" and "bar" => "foo" afterwards.
	 */
	constructor() {
		const entries = {};
		__(this).set('entries', entries);
		Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype)).forEach(([key, descriptor]) => {
			if (key === key.toUpperCase() && Object.prototype.hasOwnProperty.call(descriptor, 'get')) {
				const value = this[key];
				entries[key] = value;
				Object.defineProperty(this, value, {
					get: () => {
						return key;
					}
				});
			}
		});
	}

	/**
	 * Get enumeration keys.
	 *
	 * @returns {Array<string>}
	 */
	keys() {
		return Object.keys(__(this).get('entries'));
	}

	/**
	 * Get enumeration values.
	 *
	 * @returns {Array<*>}
	 */
	values() {
		return Object.values(__(this).get('entries'));
	}

	/**
	 * Get enumeration entries.
	 *
	 * @returns {Array<[string, *]>}
	 */
	entries() {
		return Object.entries(__(this).get('entries'));
	}

}


module.exports = Enum;
