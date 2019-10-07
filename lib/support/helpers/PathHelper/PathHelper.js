//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Path Helper
//--------------------------------------------------------
'use strict';

const path            = require('path');
const slash           = require('slash');
const PathHelperProxy = require('./PathHelperProxy');
const forwardsCall    = require('../../mixins/forwardCalls');


class PathHelper extends forwardsCall() {

	/**
	 * PathHelper constructor.
	 *
	 * @param {...Array<*>} parameters
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new PathHelperProxy());
	}

	/**
	 * @see path#basename
	 *
	 * @param {string} filePath
	 * @param {string} [extension]
	 * @returns {string}
	 */
	basename(filePath, extension) {
		return this.forwardCall('basename', [filePath, extension]);
	}

	/**
	 * @see path#dirname
	 *
	 * @param {string} filePath
	 * @returns {string}
	 */
	dirname(filePath) {
		return this.forwardCall('dirname', [filePath]);
	}

	/**
	 * @see path#extname
	 *
	 * @param {string} filePath
	 * @returns {string}
	 */
	extname(filePath) {
		return this.forwardCall('extname', [filePath]);
	}

	/**
	 * @see path#format
	 *
	 * @param {FormatInputPathObject} pathObject
	 * @returns {string}
	 */
	format(pathObject) {
		return this.forwardCall('format', [pathObject]);
	}

	/**
	 * @see path#isAbsolute
	 *
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	isAbsolute(filePath) {
		return this.forwardCall('isAbsolute', [filePath]);
	}

	/**
	 * Determines whether given path is a relative path.
	 *
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	isRelative(filePath) {
		return !this.isAbsolute(filePath);
	}

	/**
	 * @see path#join
	 *
	 * @param {...Array<string>} paths
	 * @returns {string}
	 */
	join(...paths) {
		return this.forwardCall('join', paths);
	}

	/**
	 * @see path#normalize
	 *
	 * @param {string} filePath
	 * @returns {string}
	 */
	normalize(filePath) {
		return this.forwardCall('normalize', [filePath]);
	}

	/**
	 * @see path#parse
	 *
	 * @param {string} filePath
	 * @returns {ParsedPath}
	 */
	parse(filePath) {
		return this.forwardCall('parse', [filePath]);
	}

	/**
	 * @see path#relative
	 *
	 * @param {string} from
	 * @param {string} to
	 * @returns {string}
	 */
	relative(from, to) {
		return this.forwardCall('relative', [from, to]);
	}

	/**
	 * @see path#resolve
	 *
	 * @param {...Array<string>} paths
	 * @returns {string}
	 */
	resolve(...paths) {
		return this.forwardCall('resolve', paths);
	}

	/**
	 * Convert Windows delimiters to POSIX delimiters, removing backslashes in favor of slashes.
	 *
	 * @param {string} filePath
	 * @returns {string}
	 */
	slash(filePath) {
		return slash(filePath);
	}

	/**
	 * {@inheritdoc}
	 */
	forwardCall(method, parameters) {
		const value = super.forwardCall(method, parameters.map((parameter) => {
			return typeof parameter === 'string' ? this.slash(parameter) : parameter;
		}));

		return typeof value === 'string' ? this.slash(value) : value;
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return path;
	}

}


module.exports = PathHelper;
