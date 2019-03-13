//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';


const FileManager = require('./../services/loader/FileManager');
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
		this.app.singleton('file', FileManager);
	}

}

module.exports = FileServiceProvider;
