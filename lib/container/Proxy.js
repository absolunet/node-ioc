//--------------------------------------------------------
//-- Node IoC - Container - Proxy
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const BaseProxy = require('../support/proxy/BaseProxy');


class ContainerProxy extends BaseProxy {


	/**
	 * {@inheritdoc}
	 */
	get(object, property) {
		const value = super.get(object, property);

		if (typeof value === 'undefined' && typeof property !== 'symbol') {
			try {
				return object.make(property);
			} catch (error) { // eslint-disable line-no-empty-block
			}
		}

		return value;
	}

	/**
	 * Container property check handler.
	 *
	 * @param {Container} object
	 * @param {string} property
	 * @returns {boolean}
	 */
	has(object, property) {
		return __(this).get('has')(object, property) || Boolean(__(object).get('bindings')[property]);
	}

}


module.exports = ContainerProxy;
