//--------------------------------------------------------
//-- Node IoC - Database - Services - Builder
//--------------------------------------------------------

import __           from '@absolunet/private-registry';
import BuilderProxy from './BuilderProxy';


/**
 * Database connection builder that uses configuration to create connection without effort.
 *
 * @memberof database.services
 * @hideconstructor
 */
class Builder {

	/**
	 * Class dependencies: <code>['config', 'db.connection']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['config', 'db.connection'];
	}

	/**
	 * Builder constructor.
	 *
	 * @returns {database.services.Builder} A connection builder wrapped by a forward proxy to forward calls to the default connection.
	 */
	constructor() {
		return new Proxy(this, new BuilderProxy());
	}

	/**
	 * Get connection by name.
	 *
	 * @param {string} [name="default"] - The connection name.
	 * @returns {Knex} A Knex connection instance.
	 */
	getConnection(name = 'default') {
		if (name === 'default') {
			return this.getConnection(this.config.get('database.default'));
		}

		const config = this.config.get(`database.connections.${name}`);

		if (!config) {
			throw new TypeError(`Database connection [${name}] was not configured.`);
		}

		if (!config.driver) {
			throw new TypeError(`Database connection [${name}] configuration must define a driver.`);
		}

		return this.dbConnection.driver(config.driver).getOrCreateConnection(name, config);
	}

	/**
	 * Get default connection.
	 *
	 * @returns {Knex} A Knex connection instance.
	 */
	getDefaultConnection() {
		return this.getConnection('default');
	}

	/**
	 * Retrieve driver for connection by name.
	 *
	 * @param {string|Knex} name - Either a connection name or a Knex connection instance.
	 * @returns {database.services.Connector.drivers.Driver} The underlying driver instance.
	 */
	getDriverForConnection(name = 'default') {
		const connection = typeof name === 'function' ? name : this.getConnection(name);

		return __(connection).get('driver');
	}

	/**
	 * Get default connection for forward calls.
	 *
	 * @returns {Knex} The connection instance.
	 */
	getForward() {
		return this.getDefaultConnection();
	}

}


export default Builder;
