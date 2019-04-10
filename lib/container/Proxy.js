//--------------------------------------------------------
//-- Node IoC - Container - Proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const BaseProxy = require('./../support/proxy/BaseProxy');


class ContainerProxy extends BaseProxy {


	/**
	 * {@inheritdoc}
	 */
	get(obj, prop) {
		const value = super.get(obj, prop);

		return typeof value === 'undefined' ? obj.make(prop) : value;
	}

	/**
	 * Container property check handler.
	 *
	 * @param {Container} obj
	 * @param {string} prop
	 * @returns {boolean}
	 */
	has(obj, prop) {
		return __(this).get('has')(obj, prop) || Boolean(__(obj).get('bindings')[prop]);
	}

}

module.exports = ContainerProxy;
