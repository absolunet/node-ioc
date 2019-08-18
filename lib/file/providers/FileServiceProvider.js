//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const path = require('path');

const FileEngine      = require('./../services/engine/FileEngine');
const FileManager     = require('./../services/manager/FileManager');
const ServiceProvider = require('./../../foundation/ServiceProvider');


class FileServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
	}

	/**
	 * Register file services.
	 */
	registerServices() {
		this.app.singleton('file.engine', FileEngine);
		this.app.singleton('file',        FileManager);
	}

}


module.exports = FileServiceProvider;
