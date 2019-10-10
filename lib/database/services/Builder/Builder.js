//--------------------------------------------------------
//-- Node IoC - Database - Services - Builder
//--------------------------------------------------------
'use strict';


const __           = require('@absolunet/private-registry');
const BuilderProxy = require('./BuilderProxy');
const forwardCalls = require('../../../support/mixins/forwardCalls');


class Builder extends forwardCalls() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['config', 'db.connection'];
	}

	/**
	 * Builder constructor.
	 *
	 * @param {...Array<*>} parameters
	 * @returns {Builder}
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new BuilderProxy());
	}

	/**
	 * Get connection by name.
	 *
	 * @param {string} name
	 * @returns {Knex}
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
	 * @returns {Knex}
	 */
	getDefaultConnection() {
		return this.getConnection('default');
	}

	/**
	 * Retrieve driver for connection by name.
	 *
	 * @param {string|Knex} name
	 * @returns {Driver}
	 */
	getDriverForConnection(name = 'default') {
		const connection = typeof name === 'function' ? name : this.getConnection(name);

		return __(connection).get('driver');
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return this.getDefaultConnection();
	}

}

module.exports = Builder;
