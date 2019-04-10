//--------------------------------------------------------
//-- Node IoC - Foundation - Mapping - Mapper
//--------------------------------------------------------
'use strict';


const checksTypes = require('./../../support/mixins/checksTypes');
const to = require('to-case');


class Mapper extends checksTypes() {

	/**
	 * Model constructor accessor.
	 *
	 * @returns {Function<Model>}
	 */
	get model() {
		throw new TypeError('Accessor [model] must be implemented. It should return a Model constructor.');
	}

	/**
	 * Map data to model instance.
	 *
	 * @param {*} data
	 * @param {Model|null} model
	 * @returns {Model}
	 */
	map(data = {}, model = null) {
		const { Model } = this;
		const modelInstance = model || new Model();

		Object.keys(data).forEach((attribute) => {
			this.mapAttribute(attribute, data[attribute], modelInstance);
		});

		return modelInstance;
	}

	/**
	 * Map single attribute to model instance.
	 *
	 * @param {string} attribute
	 * @param {*} value
	 * @param {Model} model
	 */
	mapAttribute(attribute, value, model) {
		if (this.hasAttributeMapper(attribute)) {
			this.callAttributeMapper(attribute, value, model);
		} else {
			model.setAttribute(attribute, value);
		}
	}

	/**
	 * Call the appropriate attribute mapper method.
	 *
	 * @param {string} attribute
	 * @param {*} value
	 * @param {Model} model
	 */
	callAttributeMapper(attribute, value, model) {
		this[this.getAttributeMapperMethodName(attribute)](value, model);
	}

	/**
	 * Check if mapper has a specific attribute mapper.
	 *
	 * @param {string} attribute
	 * @returns {boolean}
	 */
	hasAttributeMapper(attribute) {
		return this.methodExists(this.getAttributeMapperMethodName(attribute));
	}

	/**
	 * Get specific attribute mapper method name.
	 *
	 * @param {string} property
	 * @returns {string}
	 */
	getAttributeMapperMethodName(property) {
		return `map${to.pascal(property)}Attribute`;
	}

}

module.exports = Mapper;
