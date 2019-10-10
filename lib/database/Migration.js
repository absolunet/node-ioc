//--------------------------------------------------------
//-- Node IoC - Database - Migration
//--------------------------------------------------------
'use strict';

const __          = require('@absolunet/private-registry');
const Application = require('../foundation/Application');


class Migration {

	/**
	 * Call up method on instance.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 */
	static async up(connection) {
		await this.getInstance().up(connection);
	}

	/**
	 * Call down method on instance.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 */
	static async down(connection) {
		await this.getInstance().down(connection);
	}

	/**
	 * Get migration instance as a singleton.
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
	 * Set the current Migration instance.
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
	 * Run the migrations.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 * @abstract
	 */
	up() {
		//
	}

	/**
	 * Reverse the migrations.
	 *
	 * @param {Knex} connection
	 * @returns {Promise<void>}
	 * @abstract
	 */
	down() {
		//
	}

}


module.exports = Migration;
