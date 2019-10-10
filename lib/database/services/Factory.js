//--------------------------------------------------------
//-- Node IoC - Database - Services - Factory
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Factory {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'db.model', 'faker'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('factories', {});
	}

	/**
	 * Get model factory instance by name.
	 *
	 * @param {string} name
	 * @returns {Factory}
	 */
	get(name) {
		const factory = __(this).get('factories')[name];

		if (!factory) {
			throw new TypeError(`Cannot find factory for model [${name}].`);
		}

		return factory;
	}

	/**
	 * Make a model with attributes from its associated factory.
	 *
	 * @param {string} model
	 * @param {Object<string, *>|number} [parameters={}]
	 * @param {number} [times=1]
	 * @returns {Model|Collection}
	 */
	make(model, parameters = {}, times = 1) {
		const ModelInstance = __(this).get('db.model').get(model);
		const factory       = this.get(model);
		const count         = typeof parameters === 'number' ? parameters : times;
		const properties    = typeof parameters === 'number' ? {} : parameters;

		if (count <= 0) {
			throw new TypeError('Cannot make less than one model.');
		}

		const models = [...(new Array(count)).keys()].map(() => {
			return new ModelInstance({ ...factory.make(this.faker), ...properties });
		});

		return count === 1 ? models[0] : ModelInstance.collection(models);
	}

	/**
	 * Register factory for a given model.
	 * If the model name is not provided, it will be taken from the factory instance.
	 *
	 * @param {Factory} factory
	 * @param {string|null} [model]
	 * @returns {Factory}
	 */
	register(factory, model = null) {
		const instance = this.app.make(factory);
		__(this).get('factories')[model || instance.model] = instance;

		return this;
	}

}


module.exports = Factory;
