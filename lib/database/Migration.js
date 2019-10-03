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
	 * Instance of the current class as a singleton.
	 *
	 * @returns {Seeder}
	 */
	static getInstance() {
		const key = 'instance';

		if (!__(this).get(key)) {
			__(this).set(key, Application.getInstance().make(this));
		}

		return __(this).get(key);
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
