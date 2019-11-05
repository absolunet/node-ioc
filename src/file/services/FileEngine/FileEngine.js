//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------

import FileEngineProxy from './FileEngineProxy';


/**
 * File engine that allows simple operation inside the native Node.js file system.
 *
 * Any calls that are not listed are forwarded to the sync file system.
 *
 * @memberof file.services
 * @hideconstructor
 */
class FileEngine {

	/**
	 * Class dependencies: <code>['app', 'file.system.async', 'file.system.sync']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'file.system.async', 'file.system.sync'];
	}

	/**
	 * FileEngine constructor.
	 *
	 * @returns {file.services.FileEngine} The file engine instance wrapped by a proxy.
	 */
	constructor() {
		return new Proxy(this, new FileEngineProxy());
	}

	/**
	 * Async file system.
	 *
	 * @type {file.system.Async}
	 */
	get async() {
		return this.fileSystemAsync;
	}

	/**
	 * Sync file system.
	 *
	 * @type {file.system.Sync}
	 */
	get sync() {
		return this.fileSystemSync;
	}

	/**
	 * Get the sync file system for forward calls.
	 *
	 * @returns {file.systems.Sync} The sync file system.
	 */
	getForward() {
		return this.sync;
	}

}


export default FileEngine;
