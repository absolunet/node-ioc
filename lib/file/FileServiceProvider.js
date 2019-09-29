//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const FileEngine      = require('./services/FileEngine');
const FileManager     = require('./services/FileManager');
const AsyncFileSystem = require('./systems/Async');
const SyncFileSystem  = require('./systems/Sync');


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
		this.app.singleton('file.engine',       FileEngine);
		this.app.singleton('file',              FileManager);
		this.app.singleton('file.system.async', AsyncFileSystem);
		this.app.singleton('file.system.sync',  SyncFileSystem);
	}

}


module.exports = FileServiceProvider;
