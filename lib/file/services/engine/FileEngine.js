//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------
'use strict';


const FileEngineProxy = require('./FileEngineProxy');
const forwardCalls = require('./../../../support/mixins/forwardCalls');
const fss = require('@absolunet/fss');
const fsp = require('@absolunet/fsp');


class FileEngine extends forwardCalls() {

	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	constructor(...args) {
		super(...args);

		return new Proxy(this, new FileEngineProxy());
	}

	init() {} // eslint-disable-line no-empty-function

	get sync() {
		return fss;
	}

	get async() {
		return fsp;
	}

	getForward() {
		const defaultSync = this.app.make('config').get('filesystem.defaults.sync', true);

		return this[defaultSync ? 'sync' : 'async'];
	}

}

module.exports = FileEngine;
