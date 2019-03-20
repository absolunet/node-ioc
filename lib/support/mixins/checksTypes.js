//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Checks types
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const GenericClass = require('./concerns/GenericClass');


module.exports = (SuperClass = GenericClass) => {

	return class ChecksTypesMixin extends SuperClass {

		/**
		 * Check if the given object is instantiable.
		 *
		 * @param {Function|*} obj
		 * @returns {boolean}
		 */
		isInstantiable(obj) {
			return Boolean(obj) && Boolean(obj.prototype) && Boolean(obj.prototype.constructor.name);
		}

		/**
		 * Check if the given object is a function.
		 *
		 * @param {Function|*} obj
		 * @returns {boolean}
		 */
		isFunction(obj) {
			return typeof obj === 'function';
		}

		/**
		 * Check if the given object is an object.
		 *
		 * @param obj
		 * @returns {boolean}
		 */
		isObject(obj) {
			return typeof obj === 'object' && obj !== null;
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

	};

};
