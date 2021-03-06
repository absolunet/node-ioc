//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Driver
//--------------------------------------------------------

import __                  from '@absolunet/private-registry';
import hasEngine           from '../../../../support/mixins/hasEngine';
import NotImplementedError from '../../../../foundation/exceptions/NotImplementedError';

/* istanbul ignore next */
/**
 * Abstract ORM driver.
 *
 * @abstract
 * @memberof database.services.ORM.drivers
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class Driver extends hasEngine() {

	/**
	 * Class dependencies: <code>['app', 'connection', 'db.resolver', 'file', 'helper.string']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'connection', 'db.resolver', 'file', 'helper.string']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		this.setEngine(this.buildEngine(this.connection));
		const models = __(this.constructor).get('models') || {};
		__(this.constructor).set('models', models);
		Object.entries(models).forEach(([name, model]) => {
			this.model(name, model);
		});
	}

	/**
	 * Build an engine with given connection.
	 *
	 * @param {Knex} connection - The Knex connection instance.
	 * @returns {*} The ORM engine.
	 * @abstract
	 */
	buildEngine(connection) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'buildEngine', 'ORM engine');
	}

	/**
	 * Get ORM driver with given connection.
	 *
	 * @param {Knex} connection - The Knex connection instance.
	 * @returns {translation.services.Translator.drivers.Driver} The current driver instance.
	 */
	withConnection(connection) {
		return this.app.make(this.constructor, { connection });
	}

	/**
	 * Get and/or set model.
	 * If name and model are provided, the model is registered as name in the engine.
	 *
	 * @param {string} name - The model name.
	 * @param {database.Model} [Model] - The model class.
	 * @returns {database.Model} Model instance.
	 */
	model(name, Model) {
		if (!Model) {
			return this.getModel(name);
		}

		__(this.constructor).get('models')[name] = Model;

		const model = this.buildModel(Model);
		this.setModel(name, model);

		return model;
	}

	/**
	 * Get model by name.
	 *
	 * @param {string} name - The model name.
	 * @returns {database.Model|null} The model instance, or null if it was not found.
	 */
	getModel(name) {
		return this.engine.model(name);
	}

	/**
	 * Set model with given name.
	 *
	 * @param {string} name - The model name.
	 * @param {database.Model} model - The model instance.
	 */
	setModel(name, model) {
		this.engine.model(name, model);
	}

	/**
	 * Resolve model instance by name from the models path in the database resolver.
	 *
	 * @param {string} name - The model name.
	 * @returns {database.Model|null} A model instance.
	 */
	resolveModel(name) {
		const fullModelPath = this.app.formatPath(this.dbResolver.resolvePath('models'), `${this.getFormattedModelClassName(name)}.js`);

		return this.file.exists(fullModelPath) ? this.buildModel(this.file.load(fullModelPath)) : null;
	}

	/**
	 * Build model.
	 *
	 * @param {database.Model} model - The model instance.
	 * @returns {database.Model} The built model instance.
	 */
	buildModel(model) {
		return model;
	}

	/**
	 * Get formatted model class name.
	 *
	 * @param {string} name - The model name.
	 * @returns {string} The formatted model name.
	 */
	getFormattedModelClassName(name) {
		return this.stringHelper.pascal(name);
	}

	/**
	 * String helper instance.
	 *
	 * @type {support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

}


export default Driver;
