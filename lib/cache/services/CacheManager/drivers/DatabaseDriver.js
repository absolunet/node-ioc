//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store resolver - Drivers - Database driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class DatabaseDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['db']);
	}

	/**
	 * {@inheritdoc}
	 */
	async get(key, defaultValue = null) {
		const result = await this.getResult(key);

		return this.getFromResult(result, defaultValue);
	}

	/**
	 * {@inheritdoc}
	 */
	async put(key, value, seconds = this.driverConfig.expiration || 600) {
		const { connection, driverConfig: { table } } = this;
		const expiresAt = seconds === 0 ? null : this.dateHelper().add(seconds, 'seconds').format('YYYY-MM-DD HH:mm:ss');
		await this.delete(key);

		await connection(table).insert({
			key: key,
			value: JSON.stringify(value),
			expires_at: expiresAt // eslint-disable-line camelcase
		});
	}

	/**
	 * {@inheritdoc}
	 */
	forever(key, value) {
		return this.put(key, value, 0);
	}

	/**
	 * {@inheritdoc}
	 */
	async increment(key, increment = 1) {
		const result = await this.getResult(key);
		const value  = await this.getFromResult(result, 0);
		const seconds = result ? result.expires_at ? this.dateHelper(result.expires_at).unix() - this.now() : null : undefined;

		await this.put(key, value + increment, seconds);
	}

	/**
	 * {@inheritdoc}
	 */
	decrement(key, decrement = 1) {
		return this.increment(key, decrement * -1);
	}

	/**
	 * {@inheritdoc}
	 */
	async delete(key) {
		const { connection, driverConfig: { table } } = this;
		await connection(table).where('key', key).delete();
	}

	/**
	 * {@inheritdoc}
	 */
	async flush() {
		const { connection, driverConfig: { table } } = this;
		await connection(table).delete();
	}

	/**
	 * Get full database result from key.
	 *
	 * @param {string} key
	 * @returns {Promise<{key: string, value: string, expires_at: string|null}|undefined>}
	 */
	async getResult(key) {
		const { connection, driverConfig: { table } } = this;
		const [result] = await connection.select().from(table).where('key', key);

		return result;
	}

	/**
	 * Get value from result.
	 *
	 * @param {{key: string, value: string, expires_at: string|null}|undefined} result
	 * @param {*} [defaultValue]
	 * @returns {Promise<*>}
	 */
	async getFromResult(result, defaultValue = null) {
		if (!result) {
			return defaultValue;
		}


		if (result.expires_at && this.dateHelper(result.expires_at).isBefore(this.dateHelper.now())) {
			await this.delete(result.key);

			return defaultValue;
		}

		try {
			return JSON.parse(result.value);
		} catch (error) {
			await this.delete(result.key);

			return defaultValue;
		}
	}

	/**
	 * @type {Knex}
	 */
	get connection() {
		return this.db.getConnection(this.driverConfig.connection);
	}

}


module.exports = DatabaseDriver;
