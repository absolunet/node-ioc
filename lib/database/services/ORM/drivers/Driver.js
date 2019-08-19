//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Driver
//--------------------------------------------------------
'use strict';

const __   = require('@absolunet/private-registry');
const path = require('path');


class Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'connection', 'db.resolver', 'file', 'helper.string'];
	}

	/**
	 * Get ORM with given connection.
	 *
	 * @param connection
	 */
	withConnection(connection) {
		return this.app.make(this.constructor, { connection });
	}

	/**
	 * Get and/or set model.
	 * If name and model are provided the model is registered as name in the engine.
	 *
	 * @param {string} name
	 * @param {Model} [model]
	 * @returns {Model}
	 */
	model(name, model) {
		if (!model) {
			return this.engine.model(name);
		}

		return this.engine.model(name, this.buildModel(model));
	}

	/**
	 * Resolve model instance by name.
	 *
	 * @param {string} name
	 * @returns {null|Model}
	 */
	resolveModel(name) {
		const modelsPath = this.resolver.resolvePath('models');
		const fullModelPath = path.resolve(modelsPath, `${this.getFormattedModelClassName(name)}.js`);

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
	 * Set underlying engine.
	 *
	 * @param {*} engine
	 */
	setEngine(engine) {
		__(this).set('engine', engine);
	}

	/**
	 * @type {*}
	 */
	get engine() {
		return __(this).get('engine');
	}

	/**
	 * @returns {StringHelper}
	 */
	get stringHelper() {
		return __(this).get('helper.string');
	}

	/**
	 * @returns {Resolver}
	 */
	get resolver() {
		return __(this).get('db.resolver');
	}

}


module.exports = Driver;
