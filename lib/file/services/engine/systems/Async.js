//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async
//--------------------------------------------------------
'use strict';

const { constructor: Fsp } = require('@absolunet/fsp');
const replaceInFile = require('replace-in-file');


class Async extends Fsp {

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

		return replaceInFile({
			...options,
			files: file,
			from: regex,
			to: replace
		});
	}

}



module.exports = Async;
