//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String
//--------------------------------------------------------
'use strict';

const StringHelperProxy = require('./StringHelperProxy');
const forwardsCall      = require('../../mixins/forwardCalls');


/**
 * String helper.
 *
 * @memberof support.helpers
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class StringHelper extends forwardsCall() {

	/**
	 * StringHelper constructor.
	 *
	 * @param {...*} parameters - The injected parameters.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new StringHelperProxy());
	}

	/**
	 * Convert to plural version of the string.
	 *
	 * @param {string} [string] - The word to pluralize.
	 * @param {number} [quantity] - How many of the word exist.
	 * @returns {string} - The pluralized word.
	 */
	plural(string, quantity = 2) {
		return require('pluralize')(string, quantity); // eslint-disable-line global-require
	}

	/**
	 * Convert to singular version of the string.
	 *
	 * @param {string} string - The word to singularize.
	 * @returns {string} - The singularized word.
	 */
	singular(string) {
		return this.plural(string, 1);
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return require('to-case'); // eslint-disable-line global-require
	}

}


module.exports = StringHelper;
