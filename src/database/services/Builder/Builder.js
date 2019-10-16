//--------------------------------------------------------
//-- Node IoC - Database - Services - Builder
//--------------------------------------------------------

import __           from '@absolunet/private-registry';
import BuilderProxy from './BuilderProxy';
import forwardCalls from '../../../support/mixins/forwardCalls';


/**
 * Database connection builder that uses configuration to create connection without effort.
 *
 * @memberof database.services
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class Builder extends forwardCalls() {

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
	 * @param {...*} parameters - The injected parameters.
	 * @returns {Builder} - A connection builder wrapped by a forward proxy to forward calls to the default connection.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new BuilderProxy());
	}

	/**
	 * Get connection by name.
	 *
	 * @param {string} [name="default"] - The connection name.
	 * @returns {Knex} - A Knex connection instance.
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
	 * @returns {Knex} - A Knex connection instance.
	 */
	getDefaultConnection() {
		return this.getConnection('default');
	}

	/**
	 * Retrieve driver for connection by name.
	 *
	 * @param {string|Knex} name - Either a connection name or a Knex connection instance.
	 * @returns {Driver} - The underlying driver instance.
	 */
	getDriverForConnection(name = 'default') {
		const connection = typeof name === 'function' ? name : this.getConnection(name);

		return __(connection).get('driver');
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return this.getDefaultConnection();
	}

}


export default Builder;
