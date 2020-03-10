"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hasEngine = _interopRequireDefault(require("../../../../support/mixins/hasEngine"));

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract driver that defines the basic interface for a view engine driver.
 *
 * @memberof view.services.Engine.drivers
 * @augments support.mixins.HasEngine
 * @abstract
 * @hideconstructor
 */
class Driver extends (0, _hasEngine.default)() {
  /**
   * Create a template instance.
   *
   * @param {string} view - The view name.
   * @returns {template} The template instance.
   * @abstract
   */
  make(view) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'make');
  }
  /**
   * Render a template with the given data.
   *
   * @param {string} view - The view name.
   * @param {*} data - The view-model data.
   * @returns {string} The rendered template as string.
   * @abstract
   */


  render(view, data) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'render');
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;