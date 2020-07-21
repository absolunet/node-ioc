"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _NotImplementedError = _interopRequireDefault(require("./exceptions/NotImplementedError"));

var _CacheServiceProvider = _interopRequireDefault(require("../cache/CacheServiceProvider"));

var _DatabaseServiceProvider = _interopRequireDefault(require("../database/DatabaseServiceProvider"));

var _HttpServiceProvider = _interopRequireDefault(require("../http/HttpServiceProvider"));

var _LogServiceProvider = _interopRequireDefault(require("../log/LogServiceProvider"));

var _SecurityServiceProvider = _interopRequireDefault(require("../security/SecurityServiceProvider"));

var _TestServiceProvider = _interopRequireDefault(require("../test/TestServiceProvider"));

var _TranslationServiceProvider = _interopRequireDefault(require("../translation/TranslationServiceProvider"));

var _ValidationServiceProvider = _interopRequireDefault(require("../validation/ValidationServiceProvider"));

var _ViewServiceProvider = _interopRequireDefault(require("../view/ViewServiceProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Kernel
//--------------------------------------------------------

/**
 * Default kernel bootstrappers.
 *
 * @type {Array<ServiceProvider>}
 * @ignore
 */
const coreBootstrappers = [_CacheServiceProvider.default, _LogServiceProvider.default, _HttpServiceProvider.default, _SecurityServiceProvider.default, _DatabaseServiceProvider.default, _TranslationServiceProvider.default, _ValidationServiceProvider.default, _ViewServiceProvider.default];
/**
 * Default dev kernel bootstrappers.
 *
 * @type {Array<ServiceProvider>}
 * @ignore
 */

const coreDevelopmentBootstrappers = [_TestServiceProvider.default];
/**
 * The base kernel for a Node IoC application.
 * It bootstraps the basic service providers into the application in order to unleash the full Node IoC power.
 *
 * @memberof foundation
 * @abstract
 * @hideconstructor
 */

class Kernel {
  /**
   * Class dependencies: <code>['app']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    coreBootstrappers.concat(this.bootstrappers).forEach(bootstrapper => {
      this.app.register(bootstrapper);
    });
    this.app.onBooted(() => {
      if (this.app.environment !== 'production') {
        coreDevelopmentBootstrappers.forEach(bootstrapper => {
          this.app.register(bootstrapper);
        });
      }
    });
  }
  /**
   * Handle the incoming request.
   *
   * @returns {Promise} The async process promise.
   * @async
   * @abstract
   */


  handle() {
    throw new _NotImplementedError.default(this, 'handle');
  }
  /**
   * Terminate the request handling.
   */


  terminate() {//
  }
  /**
   * Bootstrapper service providers accessor.
   *
   * @type {Array<ServiceProvider>}
   */


  get bootstrappers() {
    return [];
  }

}

var _default = Kernel;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;