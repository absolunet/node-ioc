//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const ConnectorProxy = require('./ConnectorProxy');
const hasDriver = require('./../../../support/mixins/hasDriver');
const SqliteDriver = require('./drivers/SqliteDriver');


const drivers = {
	sqlite: SqliteDriver
};


class Connector extends hasDriver() {

	static get dependencies() {
		return (super.dependencies || []).concat(['config']);
	}

	constructor(config, ...args) {
		return new Proxy(super(...args), new ConnectorProxy());
	}

	init() {
		super.init();
		const config = this.config.get('database.connections');

		Object.keys(config).forEach((name) => {
			this.addDriver(name, (app) => {
				const driver = app.make(drivers[config[name].driver]);
				driver.setDefaultConnection(config[name]);

				return driver;
			});
		});

		this.setDefaultDriver(this.config.get('database.default', 'sqlite'));
	}

}

module.exports = Connector;
