//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM
//--------------------------------------------------------

import checksTypes     from '../../../support/mixins/checksTypes';
import hasDriver       from '../../../support/mixins/hasDriver';
import BookshelfDriver from './drivers/BookshelfDriver';


/**
 * ORM to interact with the database with an Active Record Pattern (ARP).
 *
 * @memberof database.services
 * @augments support.mixins.HasDriver
 * @augments support.mixins.CheckTypes
 * @hideconstructor
 */
class ORM extends hasDriver(checksTypes()) {

	/**
	 * Class dependencies: <code>['app', 'db', 'helper.string']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['db', 'helper.string']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();
		this.addDriver('bookshelf', BookshelfDriver);
		this.setDefaultDriver('bookshelf');
	}

	/**
	 * Register model.
	 * If a single argument is provided, the model class name will be used as identifier.
	 *
	 * @param {string} name - The model name.
	 * @param {database.Model} Model - The model class.
	 */
	registerModel(name, Model) {
		const modelName = this.getFormattedModelName(typeof name === 'string' ? name : name.name);

		this.driver().model(modelName, Model || name);
	}

	/**
	 * Retrieve model by name.
	 *
	 * @param {string} name - The model name.
	 * @returns {database.Model} The model instance.
	 */
	getModel(name) {
		return this.driver().model(this.getFormattedModelName(name));
	}

	/**
	 * Get formatted model name.
	 *
	 * @param {string} name - The model name.
	 * @returns {string} The formatted model name.
	 */
	getFormattedModelName(name) {
		return this.stringHelper.camel(name);
	}

	/**
	 * Get underlying ORM engine.
	 *
	 * @param {string} driver - The driver name to get engine from.
	 * @returns {*} The underlying engine.
	 */
	engine(driver) {
		return this.driver(driver).engine;
	}

	/**
	 * @inheritdoc
	 */
	addDriver(name, driver) {
		return super.addDriver(name, (app) => {
			return app.make(driver, { connection: this.db.getConnection() });
		});
	}

	/**
	 * String helper.
	 *
	 * @type {support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

}


export default ORM;
