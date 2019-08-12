//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------
'use strict';

const hasDriver      = require('../../../support/mixins/hasDriver');
const ConnectorProxy = require('./ConnectorProxy');
const SqliteDriver   = require('./drivers/SqliteDriver');


const drivers = {
	sqlite: SqliteDriver
};


class Connector extends hasDriver() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config']);
	}

	/**
	 * Connector constructor.
	 *
	 * @param {...*[]} parameters
	 * @returns {Connector}
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new ConnectorProxy());
	}

	/**
	 * {@inheritdoc}
	 */
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

		this.setDefaultDriver(this.config.get('database.default'));
	}

}


module.exports = Connector;
