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
	register(name, Model) {
		this.orm.registerModel(name, Model);
	}

	/**
	 * Get a model by name.
	 *
	 * @param {string} name
	 * @returns {Model}
	 */
	get(name) {
		return this.orm.getModel(name);
	}

	/**
	 * Check if a model exists.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	exists(name) {
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
