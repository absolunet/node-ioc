//--------------------------------------------------------
//-- Node IoC - Database - Repositories - Model Repository
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class ModelRepository {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['db.orm'];
	}

	/**
	 * Register a model.
	 *
	 * @param {string} name
	 * @param {Model} Model
	 */
	set(name, Model) {
		this.orm.registerModel(name, Model);
	}

	/**
	 * Get a model by name.
	 *
	 * @param {string} name
	 * @returns {Model}
	 * @throws
	 */
	get(name) {
		const model = this.orm.getModel(name);

		if (!model) {
			throw new TypeError(`Model [${name}] not found.`);
		}

		return model;
	}

	/**
	 * Check if a model exists.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		try {
			return Boolean(this.get(name));
		} catch (error) {
			return false;
		}
	}

	/**
	 * @type {ORM}
	 */
	get orm() {
		return __(this).get('db.orm');
	}

}


module.exports = ModelRepository;
