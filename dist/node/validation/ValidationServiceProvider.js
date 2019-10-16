"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Validator = _interopRequireDefault(require("./services/Validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Validation - Validation Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The validation service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="validation.services.Validator.html">validator</a></li>
 * </ul>
 *
 * @memberof validation
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class ValidationServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('validator', _Validator.default);
  }

}

var _default = ValidationServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;