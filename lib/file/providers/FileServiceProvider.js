//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const path = require('path');

const FileEngine      = require('./../services/engine/FileEngine');
const FileManager     = require('./../services/loader/FileManager');
const ServiceProvider = require('./../../foundation/ServiceProvider');


class FileServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadConfig();
	}

	/**
	 * Register file services.
	 */
	registerServices() {
		this.app.singleton('file.engine', FileEngine);
		this.app.singleton('file',        FileManager);
	}

	/**
	 * Load configuration file.
	 */
	loadConfig() {
		this.app.make('config').loadConfigFromFolder(path.join(__dirname, '..', 'config'));
	}

}


module.exports = FileServiceProvider;
