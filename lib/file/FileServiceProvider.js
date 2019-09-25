//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const FileEngine  = require('./services/FileEngine');
const FileManager = require('./services/FileManager');


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
