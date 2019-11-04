//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async
//--------------------------------------------------------

import AsyncProxy    from './AsyncProxy';


/**
 * The async file system.
 *
 * @memberof file.systems
 * @hideconstructor
 */
class Async {

	/**
	 * Async constructor.
	 *
	 * @returns {file.system.Async} The async instance wrapped by a proxy.
	 */
	constructor() {
		return new Proxy(this, new AsyncProxy());
	}

	/**
	 * Replace searched content by replacement string.
	 *
	 * @param {string} file - File name or pattern.
	 * @param {string|RegExp} search - The searched pattern.
	 * @param {string} replace - The replacement value.
	 * @param {object} [options] - The replace-in-file module options.
	 * @returns {Promise} The async process promise.
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
	 * Get @absolunet/fsp package for forward calls.
	 *
	 * @returns {*} The @absolunet/fsp package.
	 */
	getForward() {
		return require('@absolunet/fsp'); // eslint-disable-line global-require
	}

}



export default Async;
