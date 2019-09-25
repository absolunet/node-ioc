//--------------------------------------------------------
//-- Node IoC - Database - Seeder
//--------------------------------------------------------
'use strict';

const __        = require('@absolunet/private-registry');
const container = require('..');


class Seeder {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['db.model', 'db.factory'];
	}

	/**
	 * Call seed method on instance.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 */
	static async seed(connection) {
		await this.getInstance().seed(connection);
	}

	/**
	 * Instance of the current class as a singleton.
	 *
	 * @returns {Seeder}
	 */
	static getInstance() {
		const key = 'instance';

		if (!__(this).get(key)) {
			__(this).set(key, container.make(this));
		}

		return __(this).get(key);
	}

	/**
	 * Seed the application's database.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 * @abstract
	 */
	seed() {
		//
	}

	/**
	 * Retrieve the model by name.
	 *
	 * @param {string} model
	 * @returns {Model}
	 */
	model(model) {
		return __(this).get('db.model').get(model);
	}

	/**
	 * Get a factory for a model by name.
	 *
	 * @param {string} model
	 * @param {number} [times]
	 * @returns {Model|Collection}
	 */
	factory(model, times = 1) {
		return __(this).get('db.factory').make(model, times);
	}

}


module.exports = Seeder;
