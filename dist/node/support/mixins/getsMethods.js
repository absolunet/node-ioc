"use strict";

exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("./concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Mixins - Get Methods
//--------------------------------------------------------

/**
 * Gets methods mixin.
 *
 * @class
 * @name GetsMethod
 * @memberof support.mixins
 * @hideconstructor
 */
const getsMethods = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Gets methods mixin.
   */
  return class GetsMethodsMixin extends SuperClass {
    /**
     * Get all instance methods.
     *
     * @param {object} instance - The instance.
     * @returns {Array<string>} List of all instance methods.
     * @memberof support.mixins.GetsMethods
     * @instance
     */
    getMethods(instance) {
      const properties = new Set();
      let currentObject = instance;

      do {
        Object.keys(Object.getOwnPropertyDescriptors(currentObject)).forEach(name => {
          properties.add(name);
        });
        currentObject = Object.getPrototypeOf(currentObject);
      } while (currentObject && currentObject !== Object.prototype);

      return [...properties.keys()].sort();
    }

  };
});
var _default = getsMethods;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;