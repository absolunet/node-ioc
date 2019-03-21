//--------------------------------------------------------
//-- Node IoC - Support - Drivers - Null Driver proxy
//--------------------------------------------------------
'use strict';


class NullDriverProxy {

	/**
	 * NullDriverProxy constructor.
	 */
	/**
	 *
	 * @returns {{new(): {}}}
	 */
	constructor() {
		return new Proxy(class {}, this);
	}

	/**
	 * Handle construct call.
	 *
	 * @returns {NullDriverProxy}
	 */
	construct() {
		return this.newProxy();
	}

	/**
	 * Handle property access.
	 *
	 * @param {*} obj
	 * @param {string|Symbol|number} prop
	 * @returns {null|NullDriverProxy}
	 */
	get(obj, prop) {
		if (obj[prop]) {
			return obj[prop];
		}

		if (typeof prop === 'symbol') {
			return null;
		}

		return this.newProxy();
	}

	/**
	 * Handle function call on null driver.
	 *
	 * @returns {NullDriverProxy}
	 */
	apply() {
		return this.newProxy();
	}

	/**
	 * Handle extends usage.
	 *
	 * @returns {boolean}
	 */
	isExtensible() {
		return false;
	}

	/**
	 * Handle prevent extension call.
	 *
	 * @returns {boolean}
	 */
	preventExtensions() {
		return true;
	}

	/**
	 *
	 * @returns {NullDriverProxy}
	 */
	newProxy() {
		const { constructor:NullProxy } = this;

		return new NullProxy();
	}

}

module.exports = NullDriverProxy;
