//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------
'use strict';

const FileEngineProxy = require('./FileEngineProxy');
const forwardCalls    = require('../../../support/mixins/forwardCalls');


class FileEngine extends forwardCalls() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'file.system.async', 'file.system.sync']);
	}

	/**
	 * FileEngine constructor.
	 *
	 * @param {*} parameters
	 * @returns {FileEngine}
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new FileEngineProxy());
	}

	/**
	 * @type {Async}
	 */
	get async() {
		return this.fileSystemAsync;
	}

	/**
	 * @type {Sync}
	 */
	get sync() {
		return this.fileSystemSync;
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return this.sync;
	}

}


module.exports = FileEngine;
