"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _mixinFactory = _interopRequireDefault(require("./concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Mixins - Has engine
//--------------------------------------------------------

/**
 * Has engine mixin.
 *
 * @class
 * @name HasEngine
 * @memberof support.mixins
 * @hideconstructor
 */
const hasEngine = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Has engine mixin.
   */
  return class HasEngineMixin extends SuperClass {
    /**
     * Set current engine.
     *
     * @param {*} engine - The engine instance.
     * @returns {HasEngine} - The current instance.
     * @memberof support.mixins.HasEngine
     * @instance
     */
    setEngine(engine) {
      (0, _privateRegistry.default)(this).set('engine', engine);
      return this;
    }
    /**
     * Current engine accessor.
     *
     * @type {*}
     * @memberof support.mixins.HasEngine
     * @instance
     */


    get engine() {
      return (0, _privateRegistry.default)(this).get('engine');
    }

  };
});
var _default = hasEngine;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;