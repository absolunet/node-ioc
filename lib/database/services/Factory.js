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
	 * Make a model with attributes from its factory.
	 *
	 * @param {string} model
	 * @param {Object<string, *>|number} [parameters={}]
	 * @param {number} [times=1]
	 * @returns {Model|Collection}
	 */
	make(model, parameters = {}, times = 1) {
		const count      = typeof parameters === 'number' ? parameters : times;
		const properties = typeof parameters === 'number' ? {} : parameters;
		const modelInstance = __(this).get('db.model').get(model);
		if (!modelInstance) {
			throw new TypeError(`Cannot find model [${model}]`);
		}

		const factoryInstance = __(this).get('factories')[model];
		if (!factoryInstance) {
			throw new TypeError(`Cannot find factory for model [${model}]`);
		}

		const models = [];
		for (let i = count; i > 0; i--) {
			models.push(modelInstance.forge({ ...factoryInstance.make(this.faker), ...properties }));
		}

		return count <= 1 ? models[0] : modelInstance.collection(models);
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
