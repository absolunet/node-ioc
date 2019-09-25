//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Driver
//--------------------------------------------------------
'use strict';

const __                  = require('@absolunet/private-registry');
const hasEngine           = require('../../../../support/mixins/hasEngine');
const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
class Driver extends hasEngine() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'connection', 'db.resolver', 'file', 'helper.string'];
	}

	/**
	 * {@inheritdoc}
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
	 * @param {Knex} connection
	 * @returns {*}
	 * @abstract
	 */
	buildEngine() {
		throw new NotImplementedError(this, 'buildEngine', 'ORM engine');
	}

	/**
	 * Get ORM with given connection.
	 *
	 * @param {Knex} connection
	 */
	withConnection(connection) {
		return this.app.make(this.constructor, { connection });
	}

	/**
	 * Get and/or set model.
	 * If name and model are provided, the model is registered as name in the engine.
	 *
	 * @param {string} name
	 * @param {Model} [Model]
	 * @returns {Model}
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
	 * @param {string} name
	 * @returns {Model|null}
	 */
	getModel(name) {
		return this.engine.model(name);
	}

	/**
	 * Set model with given name.
	 *
	 * @param {string} name
	 * @param {Model} model
	 */
	setModel(name, model) {
		this.engine.model(name, model);
	}

	/**
	 * Resolve model instance by name.
	 *
	 * @param {string} name
	 * @returns {null|Model}
	 */
	resolveModel(name) {
		this.resolver.resolvePath('models');
		const fullModelPath = this.app.path('model', `${this.getFormattedModelClassName(name)}.js`);

		return this.file.exists(fullModelPath) ? this.buildModel(this.file.load(fullModelPath)) : null;
	}

	/**
	 * Build model.
	 *
	 * @param {Model} model
	 * @returns {Model}
	 */
	buildModel(model) {
		return model;
	}

	/**
	 * Get formatted model class name.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	getFormattedModelClassName(name) {
		return this.stringHelper.pascal(name);
	}

	/**
	 * @type {StringHelper}
	 */
	get stringHelper() {
		return __(this).get('helper.string');
	}

	/**
	 * @type {Resolver}
	 */
	get resolver() {
		return __(this).get('db.resolver');
	}

}


module.exports = Driver;
