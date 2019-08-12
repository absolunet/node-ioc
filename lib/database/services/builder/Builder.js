//--------------------------------------------------------
//-- Node IoC - Database - Services - Builder
//--------------------------------------------------------
'use strict';


const __           = require('@absolunet/private-registry');
const BuilderProxy = require('./BuilderProxy');


class Builder {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['db.connection'];
	}

	/**
	 * Builder constructor.
	 *
	 * @returns {Builder}
	 */
	constructor() {
		return new Proxy(this, new BuilderProxy());
	}

	/**
	 * Get connection by name.
	 *
	 * @param {string} [connection]
	 * @returns {*|Knex}
	 */
	getConnection(connection = 'default') {
		return this.driver(connection).getConnection();
	}

	/**
	 * Get new connection instance.
	 *
	 * @param {object} [data]
	 * @returns {Knex}
	 */
	newConnection(data = {}) {
		const { driver } = data;

		return this.driver(driver).newConnection(data);
	}

	/**
	 * Clean the database of existing data.
	 * Keeps the tables.
	 * @see dropAll()
	 *
	 * @param {string} [connection]
	 * @param {object} [options]
	 */
	clean(connection, options = {}) {
		return this.callOnConnectionDriver(connection, 'clean', [options]);
	}

	dropAll(connection, options = {}) {
		return this.callOnConnectionDriver(connection, 'dropAll', [options]);
	}

	/**
	 * Get driver by name.
	 *
	 * @param {string} driver
	 * @returns {Driver}
	 */
	driver(driver) {
		return this.connector.driver(driver);
	}

	/**
	 * Call a method on connection instance driver by connection name.
	 *
	 * @param {string} connection
	 * @param {string} method
	 * @param {*[]} [parameters]
	 * @returns {*}
	 */
	callOnConnectionDriver(connection, method, parameters = []) {
		const connectionInstance = typeof connection === 'string' ? undefined : connection;
		const connectorDriver = connectionInstance ? __(connection).get('driver') : this.driver(connection);

		return connectorDriver[method](connectionInstance, ...parameters);
	}

	/**
	 * @type {Connector}
	 */
	get connector() {
		return __(this).get('db.connection');
	}

}

module.exports = Builder;
