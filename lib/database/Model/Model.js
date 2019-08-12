//--------------------------------------------------------
//-- Node IoC - Database - Model
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');
const ModelProxy = require('./ModelProxy');


class Model {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Default values.
	 *
	 * @returns {object}
	 */
	get defaults() {
		return {};
	}

	/**
	 * Flag that indicates if the model has timestamp columns.
	 *
	 * @type {boolean}
	 */
	get timestamps() {
		return true;
	}

	/**
	 * Primary key column name.
	 *
	 * @returns {string}
	 */
	get key() {
		return 'id';
	}

	/**
	 * Table name.
	 *
	 * @type {string}
	 */
	get table() {
		const stringHelper = this.app.make('helper.string');

		return stringHelper.slug(stringHelper.plural(this.constructor.name));
	}

	/**
	 * Model constructor.
	 *
	 * @param {Container} app
	 * @returns {function(): Model}
	 */
	constructor(app) {
		const { Model: model } = app.make('db.orm').driver().engine;

		__(this).set('app', app);
		__(this).set('super', model.prototype);
		__(this).set('model', model.extend(this.definition));

		const self = this;
		const factory = function() { return self; }; // eslint-disable-line prefer-arrow-callback

		return new Proxy(factory, new ModelProxy());
	}

	/**
	 * Boot the model on initialization.
	 */
	boot() {
		//
	}

	/**
	 * Get default values.
	 *
	 * @returns {object}
	 */
	getDefaults() {
		return this.defaults;
	}

	/**
	 * Get if the model has timestamp columns.
	 *
	 * @returns {boolean}
	 */
	getHasTimestamps() {
		return this.timestamps;
	}

	/**
	 * Get primary key column name.
	 *
	 * @returns {string}
	 */
	getIdAttribute() {
		return this.key;
	}

	/**
	 * Get a list of all processors.
	 *
	 * @returns {Object}
	 */
	getProcessors() {
		return this.processors;
	}

	/**
	 * Get table name.
	 *
	 * @returns {string}
	 */
	getTableName() {
		return this.table;
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return __(this).get('model');
	}

	/**
	 * Create a new record in the database.
	 *
	 * @param {object} attributes
	 * @returns {Promise<Model>}
	 */
	async create(attributes) {
		await this.getForward().forge(attributes).save();

		return this;
	}

	/**
	 * Get model definition for the underlying model system.
	 *
	 * @returns {object}
	 */
	get definition() {
		const self = this;

		return {
			defaults:      this.getDefaults(),
			hasTimestamps: this.getHasTimestamps(),
			idAttribute:   this.getIdAttribute(),
			processors:    this.getProcessors(),
			tableName:     this.getTableName(),
			uuid:          true,
			initialize:    function() {
				__(self).get('super').initialize.call(this);

				return self.boot(this);
			}
		};
	}

	/**
	 * @type {Container}
	 */
	get app() {
		return __(this).get('app');
	}

}


module.exports = Model;
