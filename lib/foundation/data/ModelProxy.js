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
	get(object, property) {
		const value = super.get(object, property);

		return typeof value === 'undefined' ? object.getAttribute(property) : value;
	}

	/**
	 * Mapper property mutator.
	 *
	 * @param {Model} object
	 * @param {string} property
	 * @param {*} value
	 * @returns {boolean}
	 */
	set(object, property, value) {
		object.setAttribute(property, value);

		return true;
	}

	/**
	 * Mapper property check handler.
	 *
	 * @param {Container} object
	 * @param {string} property
	 * @returns {boolean}
	 */
	has(object, property) {
		return __(this).get('has')(object, property) || typeof object.getAttributes()[property] !== 'undefined';
	}

}


module.exports = ModelProxy;
