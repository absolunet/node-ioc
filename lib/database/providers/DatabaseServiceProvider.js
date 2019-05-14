//--------------------------------------------------------
//-- SparQL - Providers - service provider
//--------------------------------------------------------
'use strict';


const path = require('path');
const Builder = require('./../services/builder/Builder');
const Connector = require('./../services/connector/Connector');
const ServiceProvider = require('./../../foundation/ServiceProvider');


class DatabaseServiceProvider extends ServiceProvider {

	/**
	 * Register service provider.
	 */
	register() {
		this.app.make('config').loadConfigFromFolder(path.join(__dirname, '..', 'config'));
		this.registerServices();
	}

	registerServices() {
		this.app.singleton('db', Builder);
		this.app.singleton('db.connection', Connector);
	}

}

module.exports = DatabaseServiceProvider;
