//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Repository
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');


class Repository {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Resolvable mapper accessor.
	 *
	 * @returns {string}
	 * @abstract
	 */
	get mapper() {
		throw new TypeError('Accessor [mapper] must be implemented. It should return a Mapper resolvable instance.');
	}

	/**
	 * Get all items in collection.
	 *
	 * @returns {Promise<Model[]>}
	 * @abstract
	 */
	all() {
		throw new TypeError('Method all() must be implemented. It should returns a Promise<Model[]>.');
	}

	/**
	 * Get a single item in collection by identifier.
	 *
	 * @param {string|number|Symbol} id
	 * @returns {Promise<Model>}
	 * @abstract
	 */
	find() {
		throw new TypeError('Method find() must be implemented. It should return a Promise<Model>.');
	}

	/**
	 * Get a single item in collection by identifier.
	 * Throws an error if model is not found.
	 *
	 * @param {string|number|Symbol} id
	 * @throws TypeError
	 * @returns {Promise<Model>}
	 */
	async findOrFail(id) {
		const model = await this.find(id);

		if (!model) {
			throw new Error(`Model with identifier [${id}] was not found.`);
		}

		return model;
	}

	/**
	 * Create a new item and save it in collection.
	 *
	 * @param {Model|*} data
	 * @returns {boolean}
	 * @abstract
	 */
	create() {
		throw new TypeError('Method create() must be implemented. It should return a boolean.');
	}

	/**
	 * Save an item in collection.
	 *
	 * @param {Model|*} data
	 * @returns {boolean}
	 * @abstract
	 */
	save() {
		throw new TypeError('Method save() must be implemented. It should return a boolean.');
	}

	/**
	 * Delete item from collection.
	 * Can remove item from Model instance or identifier.
	 *
	 * @param {Model|string|number|Symbol} data
	 * @returns {boolean}
	 * @abstract
	 */
	delete() {
		throw new TypeError('Method delete() must be implemented. It should return a boolean.');
	}

	/**
	 * Connection resolver.
	 *
	 * @param {string|null} name
	 * @returns {*}
	 * @abstract
	 */
	getConnection() {
		throw new TypeError('Method getConnection must be implemented. It should return a connection to the data source.');
	}

	/**
	 * Format pending query.
	 *
	 * @param promise
	 * @returns {Promise<Model[]>}
	 */
	async formatQuery(promise) {
		const data = await promise;

		return this.format(data);
	}

	/**
	 * Format resolved collection.
	 *
	 * @param {Model[]} data
	 */
	format(data) {
		return this.app.make(this.mapper).map(data);
	}

	/**
	 * Initialize query through connection.
	 *
	 * @returns {*}
	 */
	query() {
		return this.getConnection();
	}

}

module.exports = Repository;
