//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------

import FileEngineProxy from './FileEngineProxy';
import forwardCalls    from '../../../support/mixins/forwardCalls';


/**
 * File engine that allows simple operation inside the native Node.js file system.
 *
 * Any calls that are not listed are forwarded to the sync file system.
 *
 * @memberof file.services
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class FileEngine extends forwardCalls() {

	/**
	 * Class dependencies: <code>['app', 'file.system.async', 'file.system.sync']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'file.system.async', 'file.system.sync']);
	}

	/**
	 * FileEngine constructor.
	 *
	 * @param {...*} parameters - Injected parameters.
	 * @returns {FileEngine} - The file engine instance wrapped by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new FileEngineProxy());
	}

	/**
	 * Async file system.
	 *
	 * @type {Async}
	 */
	get async() {
		return this.fileSystemAsync;
	}

	/**
	 * Sync file system.
	 *
	 * @type {Sync}
	 */
	get sync() {
		return this.fileSystemSync;
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return this.sync;
	}

}


export default FileEngine;
