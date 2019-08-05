//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Sync
//--------------------------------------------------------
'use strict';

const { constructor: Fss } = require('@absolunet/fss');
const replaceInFile = require('replace-in-file');


class Sync extends Fss {

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

		return replaceInFile.sync({
			...options,
			files: file,
			from: regex,
			to: replace
		});
	}

}



module.exports = Sync;
