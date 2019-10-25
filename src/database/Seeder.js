//--------------------------------------------------------
//-- Node IoC - Database - Seeder
//--------------------------------------------------------

import __          from '@absolunet/private-registry';
import Application from '../foundation/Application';


/**
 * Abstract seeder class.
 * Offers basic forwarding for seed method to singleton instance.
 *
 * @memberof database
 * @abstract
 * @hideconstructor
 */
class Seeder {

	/**
	 * Class dependencies: <code>['db.model', 'db.factory']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['db.model', 'db.factory'];
	}

	/**
	 * Call seed method on instance.
	 *
	 * @param {Knex} connection - The Knex connection instance.
	 * @returns {Promise} The async process promise.
	 */
	static async seed(connection) {
		await this.getInstance().seed(connection);
	}

	/**
	 * Get seeder instance as a singleton.
	 *
	 * @returns {database.Seeder} Seeder singleton instance.
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
	 * @param {database.Seeder} instance - Seeder instance.
	 * @throws {TypeError} Indicates that the default instance was not a seeder instance.
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
	 * @param {Knex} connection - The Knex connection instance.
	 * @returns {Promise} The async process promise.
	 * @abstract
	 */
	seed(connection) { // eslint-disable-line no-unused-vars
		//
	}

	/**
	 * Retrieve the model by name.
	 *
	 * @param {string} model - The model name.
	 * @returns {database.Model} The model instance.
	 */
	model(model) {
		return __(this).get('db.model').get(model);
	}

	/**
	 * Get a factory for a model by name.
	 *
	 * @param {string} model - The model name.
	 * @param {object<string, *>|number} [parameters] - The parameters to put into the model manually, overwriting matching factoried values. Can also be the times if no parameter are given.
	 * @param {number} [times] - The quantity of models that needed to be factoried. Minimum 1 model is required.
	 * @returns {Model|Collection} Either a single Model instance or a Model Collection instance, containing N times the requested model.
	 */
	factory(model, parameters, times) {
		return __(this).get('db.factory').make(model, parameters, times);
	}

}


export default Seeder;
