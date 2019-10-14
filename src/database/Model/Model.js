//--------------------------------------------------------
//-- Node IoC - Database - Model
//--------------------------------------------------------
'use strict';

const __         = require('@absolunet/private-registry');
const ModelProxy = require('./ModelProxy');


/**
 * Database model that implements ORM features to transact with Knex with an Active Record Pattern (ARP) approach.
 *
 * @memberof database
 * @abstract
 */
class Model {

	/**
	 * Class dependencies.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'engine'];
	}

	/**
	 * Default values.
	 *
	 * @type {object}
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
	 * @type {string}
	 */
	get key() {
		return 'id';
	}

	/**
	 * Primary key column type.
	 *
	 * @type {string}
	 */
	get keyType() {
		return 'uuid';
	}

	/**
	 * Table name.
	 *
	 * @type {string}
	 */
	get table() {
		const stringHelper = this.app.make('helper.string');

		return stringHelper.snake(stringHelper.plural(this.constructor.name));
	}

	/**
	 * Model constructor.
	 *
	 * @param {Application} app - The current application instance.
	 * @param {*} engine - The engine that exposes the base model.
	 * @returns {Function} - An engine model factory, wrapped by a proxy.
	 */
	constructor(app, engine) {
		const { Model: model } = engine;
		const self             = this;
		const factory          = function() { return self; };

		__(this).set('app',   app);
		__(this).set('super', model.prototype);
		__(this).set('model', model.extend(this.definition));

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
	 * @returns {object} - The default values.
	 */
	getDefaults() {
		return this.defaults;
	}

	/**
	 * Get if the model has timestamp columns.
	 *
	 * @returns {boolean} - Indicates that the model uses timestamps.
	 */
	getHasTimestamps() {
		return this.timestamps;
	}

	/**
	 * Get primary key column name.
	 *
	 * @returns {string} - The primary column name.
	 */
	getIdAttribute() {
		return this.key;
	}

	/**
	 * Get primary key column type.
	 *
	 * @returns {string} - The primary column type.
	 */
	getIdType() {
		return this.keyType;
	}

	/**
	 * Get a list of all processors.
	 *
	 * @returns {object<string, Function>} - The processors list for each columns.
	 */
	getProcessors() {
		const date = this.app.make('helper.date');

		return {
			...Object.fromEntries(['created_at', 'updated_at']
				.map((timestamp) => {
					return [
						timestamp,
						(value) => {
							return date(value).format('YYYY-MM-DD HH:mm:ss');
						}
					];
				})),
			...this.processors
		};
	}

	/**
	 * Get table name.
	 *
	 * @returns {string} - The table name.
	 */
	getTableName() {
		return this.table;
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return __(this).get('model');
	}

	/**
	 * Create a new record in the database.
	 *
	 * @param {object} attributes - The attributes to create the model with.
	 * @returns {Promise<Model>} - The newly created model instance.
	 */
	async create(attributes) {
		await this.getForward().forge(attributes).save();

		return this;
	}

	/**
	 * Get model definition for the underlying model system.
	 *
	 * @type {object}
	 */
	get definition() {
		const self = this;

		return {
			defaults:      this.getDefaults(),
			hasTimestamps: this.getHasTimestamps(),
			idAttribute:   this.getIdAttribute(),
			processors:    this.getProcessors(),
			tableName:     this.getTableName(),
			uuid:          this.getIdType() === 'uuid',
			initialize() {
				__(self).get('super').initialize.call(this);

				return self.boot(this);
			}
		};
	}

	/**
	 * Application accessor.
	 *
	 * @type {Application}
	 */
	get app() {
		return __(this).get('app');
	}

}


module.exports = Model;
