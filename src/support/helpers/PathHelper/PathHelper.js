//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Path Helper
//--------------------------------------------------------

import slash           from 'slash';
import PathHelperProxy from './PathHelperProxy';
import forwardsCall    from '../../mixins/forwardCalls';


/**
 * Path helper.
 *
 * @memberof support.helpers
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class PathHelper extends forwardsCall() {

	/**
	 * PathHelper constructor.
	 *
	 * @param {...*} parameters - The injected parameters.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new PathHelperProxy());
	}

	/**
	 * Return the last portion of a path. Similar to the Unix basename command.
	 * Often used to extract the file name from a fully qualified path.
	 *
	 * @see path#basename
	 *
	 * @param {string} filePath - The path to evaluate.
	 * @param {string} [extension] - An extension to remove from the result.
	 * @returns {string} The basename of the given file path.
	 */
	basename(filePath, extension) {
		return this.forwardCall('basename', [filePath, extension]);
	}

	/**
	 * Return the directory name of a path. Similar to the Unix dirname command.
	 *
	 * @see path#dirname
	 *
	 * @param {string} filePath - The path to evaluate.
	 * @returns {string} The directory name of the given file path.
	 */
	dirname(filePath) {
		return this.forwardCall('dirname', [filePath]);
	}

	/**
	 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
	 * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
	 *
	 * @see path#extname
	 *
	 * @param {string} filePath - The path to evaluate.
	 * @returns {string} The extension name of the given file path.
	 */
	extname(filePath) {
		return this.forwardCall('extname', [filePath]);
	}

	/**
	 * Returns a path string from an object - the opposite of parse().
	 *
	 * @see path#format
	 *
	 * @param {FormatInputPathObject} pathObject - The path object to format.
	 * @returns {string} The formatted path.
	 */
	format(pathObject) {
		return this.forwardCall('format', [pathObject]);
	}

	/**
	 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
	 *
	 * @see path#isAbsolute
	 *
	 * @param {string} filePath - The path to test.
	 * @returns {boolean} Indicates that the path is an absolute path.
	 */
	isAbsolute(filePath) {
		return this.forwardCall('isAbsolute', [filePath]);
	}

	/**
	 * Determines whether {path} is a relative path. An absolute path will always resolve to the same location, regardless of the working directory.
	 *
	 * @see PathHelper#isAbsolute
	 *
	 * @param {string} filePath - The path to test.
	 * @returns {boolean} Indicates that the path is a relative path.
	 */
	isRelative(filePath) {
		return !this.isAbsolute(filePath);
	}

	/**
	 * Join all arguments together and normalize the resulting path.
	 * Arguments must be strings. In v0.8, non-string arguments were silently ignored. In v0.10 and up, an exception is thrown.
	 *
	 * @see path#join
	 *
	 * @param {...Array<string>} paths - The paths to join.
	 * @returns {string} The joined path.
	 */
	join(...paths) {
		return this.forwardCall('join', paths);
	}

	/**
	 * Normalize a string path, reducing '..' and '.' parts.
	 * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used.
	 *
	 * @see path#normalize
	 *
	 * @param {string} filePath - The path to normalize.
	 * @returns {string} The normalized path.
	 */
	normalize(filePath) {
		return this.forwardCall('normalize', [filePath]);
	}

	/**
	 * Returns an object from a path string - the opposite of format().
	 *
	 * @see path#parse
	 *
	 * @param {string} filePath - The path to evaluate.
	 * @returns {ParsedPath} The parsed path object.
	 */
	parse(filePath) {
		return this.forwardCall('parse', [filePath]);
	}

	/**
	 * Solve the relative path from {from} to {to}.
	 * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
	 *
	 * @see path#relative
	 *
	 * @param {string} from - The starting path.
	 * @param {string} to - The ending path.
	 * @returns {string} The relative path.
	 */
	relative(from, to) {
		return this.forwardCall('relative', [from, to]);
	}

	/**
	 * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
	 *
	 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
	 *
	 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
	 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
	 * the current working directory is used as well. The resulting path is normalized,
	 * and trailing slashes are removed unless the path gets resolved to the root directory.
	 *
	 * @see path#resolve
	 *
	 * @param {...Array<string>} paths - The paths to join.  Non-string arguments are ignored.
	 * @returns {string} The resolved path.
	 */
	resolve(...paths) {
		return this.forwardCall('resolve', paths);
	}

	/**
	 * Convert Windows delimiters to POSIX delimiters, removing backslashes in favor of slashes.
	 *
	 * @param {string} filePath - The path to format.
	 * @returns {string} The formatted path.
	 */
	slash(filePath) {
		return slash(filePath);
	}

	/**
	 * @inheritdoc
	 */
	forwardCall(method, parameters) {
		const value = super.forwardCall(method, parameters.map((parameter) => {
			return typeof parameter === 'string' ? this.slash(parameter) : parameter;
		}));

		return typeof value === 'string' ? this.slash(value) : value;
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return require('path'); // eslint-disable-line global-require
	}

}


export default PathHelper;
