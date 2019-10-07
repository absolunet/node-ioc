//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------
'use strict';

const StringHelperProxy = require('./StringHelperProxy');
const forwardsCall      = require('../../mixins/forwardCalls');


class StringHelper extends forwardsCall() {

	/**
	 * StringHelper constructor.
	 *
	 * @param {...Array<*>} parameters
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new StringHelperProxy());
	}

	/**
	 * Convert to plural version of the string.
	 *
	 * @param {string} [string]
	 * @param {number} [quantity]
	 */
	plural(string, quantity = 2) {
		return require('pluralize')(string, quantity); // eslint-disable-line global-require
	}

	/**
	 * Convert to singular version of the string.
	 *
	 * @param string
	 * @returns {string}
	 */
	singular(string) {
		return this.plural(string, 1);
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return require('to-case'); // eslint-disable-line global-require
	}

}


module.exports = StringHelper;
