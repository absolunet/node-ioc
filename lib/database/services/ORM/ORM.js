//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM
//--------------------------------------------------------
'use strict';

const __          = require('@absolunet/private-registry');
const checksTypes = require('../../../support/mixins/checksTypes');
const hasDriver   = require('../../../support/mixins/hasDriver');

const BookshelfDriver = require('./drivers/BookshelfDriver');


class ORM extends hasDriver(checksTypes()) {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || [])
			.concat(['db', 'helper.string']);
	}

	/**
	 * {@inheritdoc}
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
	 * @param {string} name
	 * @param {Model} Model
	 */
	registerModel(name, Model) {
		const modelName = this.getFormattedModelName(typeof name === 'string' ? name : name.name);

		this.driver().model(modelName, Model || name);
	}

	/**
	 * Retrieve model by name.
	 *
	 * @param {string} name
	 * @returns {Model}
	 */
	getModel(name) {
		return this.driver().model(this.getFormattedModelName(name));
	}

	/**
	 * Get formatted model name.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	getFormattedModelName(name) {
		return this.stringHelper.camel(name);
	}

	/**
	 * Get underlying ORM engine.
	 *
	 * @param {string} driver
	 * @returns {*}
	 */
	engine(driver) {
		return this.driver(driver).engine;
	}

	/**
	 * {@inheritdoc}
	 */
	addDriver(name, driver) {
		return super.addDriver(name, (app) => {
			return app.make(driver, { connection: this.db.getConnection() });
		});
	}

	/**
	 * @returns {StringHelper}
	 */
	get stringHelper() {
		return __(this).get('helper.string');
	}

}


module.exports = ORM;
