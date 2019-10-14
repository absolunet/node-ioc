//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Checks types
//--------------------------------------------------------
'use strict';

const factory = require('./concerns/mixinFactory');
/**
 * Check types mixin.
 *
 * @class
 * @name CheckTypes
 * @memberof support.mixins
 * @hideconstructor
 */


const checkTypes = factory(SuperClass => {
  /**
   * Checks types mixin.
   */
  return class CheckTypesMixin extends SuperClass {
    /**
     * Check if the given object is instantiable.
     *
     * @param {*} object - The object to test.
     * @returns {boolean} - Indicates that the object is instantiable.
     * @memberof support.mixins.CheckTypesMixin
     * @instance
     */
    isInstantiable(object) {
      return Boolean(object) && Boolean(object.prototype) && Boolean(object.prototype.constructor.name);
    }
    /**
     * Check if the given object is a function.
     *
     * @param {*} object - The object to test.
     * @returns {boolean} - Indicates that the object is a function.
     * @memberof support.mixins.CheckTypesMixin
     * @instance
     */


    isFunction(object) {
      return typeof object === 'function';
    }
    /**
     * Check if the given object is an object.
     *
     * @param {*} object - The object to test.
     * @returns {boolean} - Indicates that the object is an object.
     * @memberof support.mixins.CheckTypesMixin
     * @instance
     */


    isObject(object) {
      return typeof object === 'object' && object !== null;
    }
    /**
     * Check if method exists in current instance.
     *
     * @param {string} method - The method to test.
     * @returns {boolean} - Indicates that the method exists in current instance.
     * @memberof support.mixins.CheckTypesMixin
     * @instance
     */


    methodExists(method) {
      return this.isFunction(this[method]);
    }

  };
});
module.exports = checkTypes;