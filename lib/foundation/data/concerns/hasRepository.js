//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Concerns - Has Repository
//--------------------------------------------------------
'use strict';


const { factory } = require('./../../../support/mixins');


module.exports = factory((SuperClass) => {

	return class HasRepository extends SuperClass {

		/**
		 * {@inheritdoc}
		 */
		static get dependencies() {
			return (super.dependencies || []).concat(['app']);
		}

		/**
		 * Create a new Model instance.
		 *
		 * @returns {Model}
		 */
		static makeInstance() {
			return this.app.make(this);
		}

		/**
		 * Model initializer.
		 */
		init() {
			this.constructor.app = this.app;
		}

		/**
		 * Repository accessor.
		 *
		 * @returns {Repository}
		 * @throws
		 */
		get repository() {
			throw new TypeError('Accessor [repository] must be implemented. It should return a Repository resolvable instance.');
		}

		/**
		 * Get all models.
		 *
		 * @returns {Promise<Model[]>}
		 * @static
		 * @see Repository
		 */
		static all() {
			return this.makeInstance().getRepository().all();
		}

		/**
		 * Get a single model.
		 *
		 * @param {*[]} args
		 * @returns {Promise<Model>}
		 * @see Repository
		 */
		static find(...args) {
			return this.makeInstance().getRepository().find(...args);
		}

		/**
		 * Get a single model.
		 *
		 * @param {*[]} args
		 * @returns {Promise<Model>}
		 * @throws
		 * @see Repository
		 */
		static findOrFail(...args) {
			return this.makeInstance().getRepository().findOrFail(...args);
		}

		/**
		 * Create the model.
		 *
		 * @param {*} data
		 * @returns {Promise<boolean>}
		 * @see Repository
		 */
		create(data = {}) {
			this.fill(data);

			return this.getRepository().create(this);
		}

		/**
		 * Save the model.
		 *
		 * @returns {Promise<boolean>}
		 * @see Repository
		 */
		save() {
			return this.getRepository().save(this);
		}

		/**
		 * Delete the model.
		 *
		 * @returns {Promise<boolean>}
		 * @see Repository
		 */
		delete() {
			return this.getRepository().delete(this);
		}

		/**
		 * Get repository resolved instance.
		 *
		 * @returns {Repository}
		 */
		getRepository() {
			return this.app.make(this.repository);
		}

	};

});
