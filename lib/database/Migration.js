//--------------------------------------------------------
//-- Node IoC - Database - Migration
//--------------------------------------------------------
'use strict';

const __        = require('@absolunet/private-registry');
const container = require('../container/Container');


class Migration {

	/**
	 * Call up method on instance.
	 *
	 * @param {Connector} connection
	 * @returns {Promise<void>}
	 */
	static async up(connection) {
		await this.instance.up(connection);
	}

	/**
	 * Call down method on instance.
	 *
	 * @param {Connector} connection
	 * @returns {Promise<void>}
	 */
	static async down(connection) {
		await this.instance.down(connection);
	}

	/**
	 * Instance of the current class as a singleton.
	 *
	 * @returns {Seeder}
	 */
	static get instance() {
		const key = 'instance';

		if (!__(this).get(key)) {
			__(this).set(key, container.getInstance().make(this));
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
