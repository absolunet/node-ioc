"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Translator = _interopRequireDefault(require("./services/Translator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Translation - Translation Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The translation service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="translation.services.Translator.html">translator</a></li>
 * </ul>
 *
 * @memberof translation
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class TranslationServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('translator', _Translator.default);
  }

}

var _default = TranslationServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;