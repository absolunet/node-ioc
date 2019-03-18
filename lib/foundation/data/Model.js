//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Model
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const ModelProxy = require('./ModelProxy');
const to = require('to-case');


class Model {

	/**
	 * Model constructor.
	 *
	 * @param {*} data
	 * @returns {Proxy<Model>}
	 */
	constructor(data = {}) {
		__(this).set('attributes', {});
		this._id = data._id || Symbol();
		this.guard();
		this.fill(data);

		return new Proxy(this, new ModelProxy());
	}

	/**
	 * Fill model with given property.
	 * If model is guarded, only the fillable properties will be mapped.
	 *
	 * @param {*} data
	 */
	fill(data = {}) {
		const keys = Object.keys(data);
		const fillable = this.fillable || keys || [];
		keys.filter((key) => {
			return !this.isGuarded || fillable.includes(key);
		}).forEach((attribute) => {
			this.setAttribute(attribute, data[attribute]);
		});
	}

	/**
	 * Get specific attribute.
	 *
	 * @param {string} attribute
	 * @returns {*}
	 */
	getAttribute(attribute) {
		if (this.hasAttributeAccessor(attribute)) {
			return this.callAttributeAccessor(attribute);
		}

		return this.getAttributes()[attribute];
	}

	/**
	 * Set specific attribute.
	 *
	 * @param {string} attribute
	 * @param {*} value
	 */
	setAttribute(attribute, value) {
		if (this.hasAttributeMutator(attribute)) {
			this.callAttributeMutator(attribute, value);
		} else {
			__(this).get('attributes')[attribute] = value;
		}
	}

	/**
	 * Get all attributes.
	 *
	 * @returns {*}
	 */
	getAttributes() {
		const data = {};
		Object.keys(__(this).get('attributes')).forEach((attribute) => {
			data[attribute] = this.getAttribute(attribute);
		});

		return data;
	}

	/**
	 * Call attribute accessor method.
	 *
	 * @param {string} attribute
	 * @returns {*}
	 */
	callAttributeAccessor(attribute) {
		this[this.getAttributeAccessorName(attribute)]();
	}

	/**
	 * Call attribute mutator method.
	 *
	 * @param {string} attribute
	 * @param {*} value
	 */
	callAttributeMutator(attribute, value) {
		this[this.getAttributeMutatorName(attribute)](value, __(this).get('attributes'));
	}

	/**
	 * Check if model has specific attribute accessor method.
	 *
	 * @param {string} attribute
	 * @returns {boolean}
	 */
	hasAttributeAccessor(attribute) {
		return this.methodExists(this.getAttributeAccessorName(attribute));
	}

	/**
	 * Check if model has specific attribute mutator method.
	 *
	 * @param {string} attribute
	 * @returns {boolean}
	 */
	hasAttributeMutator(attribute) {
		return this.methodExists(this.getAttributeMutatorName(attribute));
	}

	/**
	 * Get specific attribute accessor method name.
	 *
	 * @param {string} attribute
	 * @returns {string}
	 */
	getAttributeAccessorName(attribute) {
		return this.getAttributeMethodName(attribute, 'get');
	}

	/**
	 * Get specific attribute mutator method name.
	 *
	 * @param {string} attribute
	 * @returns {string}
	 */
	getAttributeMutatorName(attribute) {
		return this.getAttributeMethodName(attribute, 'set');
	}

	/**
	 * Get specific attribute methhod name by action.
	 *
	 * @param {string} attribute
	 * @param {string} method
	 * @returns {string}
	 */
	getAttributeMethodName(attribute, method) {
		return `${method}${to.pascal(attribute)}Attribute`;
	}

	/**
	 * Check if method exists.
	 *
	 * @param {string} method
	 * @returns {boolean}
	 */
	methodExists(method) {
		return typeof this[method] === 'function';
	}

	/**
	 * Set model guard state.
	 *
	 * @param {boolean} [guarded]
	 */
	guard(guarded = true) {
		__(this).set('guarded', guarded);
	}

	/**
	 * Unguard model.
	 */
	unguard() {
		this.guard(false);
	}

	/**
	 * Check if model is guarded.
	 *
	 * @returns {boolean}
	 */
	get isGuarded() {
		return __(this).get('guarded');
	}

}

module.exports = Model;
