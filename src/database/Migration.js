//--------------------------------------------------------
//-- Node IoC - Database - Migration
//--------------------------------------------------------

import __          from '@absolunet/private-registry';
import Application from '../foundation/Application';


/**
 * Abstract migration class.
 * Offers basic forwarding for up and down method to singleton instance.
 *
 * @memberof database
 * @abstract
 * @hideconstructor
 */
class Migration {

	/**
	 * Call up method on instance.
	 *
	 * @param {Knex} connection - The Knex connection instance.
	 * @returns {Promise} The async process promise.
	 */
	static async up(connection) {
		await this.getInstance().setConnection(connection).up();
	}

	/**
	 * Call down method on instance.
	 *
	 * @param {Knex} connection - The Knex connection instance.
	 * @returns {Promise} The async process promise.
	 */
	static async down(connection) {
		await this.getInstance().setConnection(connection).down();
	}

	/**
	 * Get migration instance as a singleton.
	 *
	 * @returns {database.Migration} Migration singleton instance.
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
	 * Set the current migration instance.
	 *
	 * @param {database.Migration} instance - Migration instance.
	 * @throws {TypeError} Indicates that the default instance was not a migration instance.
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
	 * @returns {Promise} The async process promise.
	 * @abstract
	 */
	up() {
		//
	}

	/**
	 * Reverse the migrations.
	 *
	 * @returns {Promise} The async process promise.
	 * @abstract
	 */
	down() {
		//
	}

	/**
	 * Set current connection instance.
	 *
	 * @param {Knex} connection - The current connection instance.
	 * @returns {database.Migration} Current migration instance.
	 */
	setConnection(connection) {
		__(this).set('connection', connection);

		return this;
	}

	/**
	 * The current connection instance.
	 *
	 * @type {Knex}
	 */
	get connection() {
		return __(this).get('connection');
	}

}


export default Migration;
