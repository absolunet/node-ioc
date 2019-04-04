//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Mapping proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const BaseProxy = require('./../../support/proxy/BaseProxy');


class ModelProxy extends BaseProxy {

	/**
	 * {@inheritdoc}
	 */
	get(obj, prop) {
		const value = super.get(obj, prop);

		return typeof value === 'undefined' ? obj.getAttribute(prop) : value;
	}

	/**
	 * Mapper property mutator.
	 *
	 * @param {Model} obj
	 * @param {string} prop
	 * @param {*} value
	 * @returns {boolean}
	 */
	set(obj, prop, value) {
		obj.setAttribute(prop, value);

		return true;
	}

	/**
	 * Mapper property check handler.
	 *
	 * @param {Container} obj
	 * @param {string} prop
	 * @returns {boolean}
	 */
	has(obj, prop) {
		return __(this).get('has')(obj, prop) || typeof obj.getAttributes()[prop] !== 'undefined';
	}

}

module.exports = ModelProxy;
