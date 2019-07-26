//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------
'use strict';

const __              = require('@absolunet/private-registry');
const FileEngineProxy = require('./FileEngineProxy');
const forwardCalls    = require('./../../../support/mixins/forwardCalls');
const Async           = require('./systems/Async');
const Sync            = require('./systems/Sync');


class FileEngine extends forwardCalls() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
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
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('async', this.app.make(Async));
		__(this).set('sync',  this.app.make(Sync));
	}

	/**
	 * @type {Async}
	 */
	get async() {
		return __(this).get('async');
	}

	/**
	 * @type {Sync}
	 */
	get sync() {
		return __(this).get('sync');
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		const defaultSync = this.app.make('config').get('filesystem.defaults.sync', false);

		return this[defaultSync ? 'sync' : 'async'];
	}

}


module.exports = FileEngine;
