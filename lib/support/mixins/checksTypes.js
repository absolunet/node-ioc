//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Checks types
//--------------------------------------------------------
'use strict';

const factory = require('./concerns/mixinFactory');


const checkTypes = factory((SuperClass) => {

	return class ChecksTypesMixin extends SuperClass {

		/**
		 * Check if the given object is instantiable.
		 *
		 * @param {Function|*} object
		 * @returns {boolean}
		 */
		isInstantiable(object) {
			return Boolean(object) && Boolean(object.prototype) && Boolean(object.prototype.constructor.name);
		}

		/**
		 * Check if the given object is a function.
		 *
		 * @param {Function|*} object
		 * @returns {boolean}
		 */
		isFunction(object) {
			return typeof object === 'function';
		}

		/**
		 * Check if the given object is an object.
		 *
		 * @param object
		 * @returns {boolean}
		 */
		isObject(object) {
			return typeof object === 'object' && object !== null;
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

});


module.exports = checkTypes;
