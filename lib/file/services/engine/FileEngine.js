//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------
'use strict';

const fsp = require('@absolunet/fsp');
const fss = require('@absolunet/fss');

const FileEngineProxy = require('./FileEngineProxy');
const forwardCalls    = require('./../../../support/mixins/forwardCalls');


class FileEngine extends forwardCalls() {

	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new FileEngineProxy());
	}

	init() {
		//
	}

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
