//--------------------------------------------------------
//-- Node IoC - Database - Seeder
//--------------------------------------------------------
'use strict';

const __          = require('@absolunet/private-registry');
const Application = require('../foundation/Application');


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
	 * Get seeder instance as a singleton.
	 *
	 * @returns {Seeder}
	 */
	static getInstance() {
		let instance = __(this).get('instance');

		if (!instance) {
			instance = Application.getInstance().make(this);
			this.setDefaultInstance(instance);
		}

		return instance;
	}

	/**
	 * Set the current Seeder instance.
	 *
	 * @param {Seeder} instance
	 * @throws
	 */
	static setDefaultInstance(instance) {
		if (!(instance instanceof this)) {
			throw new TypeError(`Default instance must be instance of ${this.name}.`);
		}

		__(this).set('instance', instance);
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
