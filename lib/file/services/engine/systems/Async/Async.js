//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async
//--------------------------------------------------------
'use strict';

const AsyncProxy   = require('./AsyncProxy');
const forwardCalls = require('../../../../../support/mixins/forwardCalls');


class Async extends forwardCalls() {

	/**
	 * Async constructor.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new AsyncProxy());
	}

	/**
	 * Replace searched content by replacement string.
	 *
	 * @param {string} file
	 * @param {string|RegExp} search
	 * @param {string} replace
	 * @param {object} [options]
	 * @returns {Promise<*>}
	 */
	replaceInFile(file, search, replace, options = {}) {
		const flags = [...new Set([...(search.flags || '').split(''), 'g', 'u'])];
		const regex = new RegExp(search, flags.join(''));

		return require('replace-in-file')({ // eslint-disable-line global-require
			...options,
			files: file,
			from: regex,
			to: replace
		});
	}

	/**
	 * @type {Fsp}
	 */
	getForward() {
		return require('@absolunet/fsp'); // eslint-disable-line global-require
	}

}



module.exports = Async;
