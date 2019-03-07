//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';


const FileLoader = require('./../services/loader/FileLoader');
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
		this.app.singleton('file', FileLoader);
	}

}

module.exports = FileServiceProvider;
