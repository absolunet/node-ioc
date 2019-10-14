//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async
//--------------------------------------------------------
'use strict';

const AsyncProxy   = require('./AsyncProxy');
const forwardCalls = require('../../../support/mixins/forwardCalls');


/**
 * The async file system.
 *
 * @memberof file.systems
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class Async extends forwardCalls() {

	/**
	 * Async constructor.
	 *
	 * @param {...*} parameters - Injected parameters.
	 * @returns {Async} - The async instance wrapped by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new AsyncProxy());
	}

	/**
	 * Replace searched content by replacement string.
	 *
	 * @param {string} file - File name or pattern.
	 * @param {string|RegExp} search - The searched pattern.
	 * @param {string} replace - The replacement value.
	 * @param {object} [options] - The replace-in-file module options.
	 * @returns {Promise} - The async process promise.
	 */
	async replaceInFile(file, search, replace, options = {}) {
		const flags = [...new Set([...(search.flags || '').split(''), 'g', 'u'])];
		const regex = new RegExp(search, flags.join(''));

		await require('replace-in-file')({ // eslint-disable-line global-require
			...options,
			files: file,
			from: regex,
			to: replace
		});
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return require('@absolunet/fsp'); // eslint-disable-line global-require
	}

}



module.exports = Async;
