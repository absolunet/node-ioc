//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Sync
//--------------------------------------------------------
'use strict';

const SyncProxy   = require('./SyncProxy');
const forwardCalls = require('../../../support/mixins/forwardCalls');


class Sync extends forwardCalls() {

	/**
	 * Sync constructor.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new SyncProxy());
	}

	/**
	 * Replace searched content by replacement string.
	 *
	 * @param {string} file
	 * @param {string|RegExp} search
	 * @param {string} replace
	 * @param {object} [options]
	 * @returns {*}
	 */
	replaceInFile(file, search, replace, options = {}) {
		const flags = [...new Set([...(search.flags || '').split(''), 'g', 'u'])];
		const regex = new RegExp(search, flags.join(''));

		return require('replace-in-file').sync({ // eslint-disable-line global-require
			...options,
			files: file,
			from: regex,
			to: replace
		});
	}

	/**
	 * @type {Fss}
	 */
	getForward() {
		return require('@absolunet/fss'); // eslint-disable-line global-require
	}

}



module.exports = Sync;
