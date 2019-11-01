"use strict";

exports.default = void 0;

var _forwardsCalls = _interopRequireDefault(require("../../../support/mixins/forwardsCalls"));

var _hasDriver = _interopRequireDefault(require("../../../support/mixins/hasDriver"));

var _CacheManagerProxy = _interopRequireDefault(require("./CacheManagerProxy"));

var _DatabaseDriver = _interopRequireDefault(require("./drivers/DatabaseDriver"));

var _FileDriver = _interopRequireDefault(require("./drivers/FileDriver"));

var _RuntimeDriver = _interopRequireDefault(require("./drivers/RuntimeDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store Resolver
//--------------------------------------------------------

/**
 * Cache manager that uses the configuration to properly handle caching operation through drivers.
 *
 * @memberof cache.services
 * @augments support.mixins.ForwardsCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class CacheManager extends (0, _forwardsCalls.default)((0, _hasDriver.default)()) {
  /**
   * Class dependencies: <code>['app', 'config']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'config']);
  }
  /**
   * CacheManager constructor.
   *
   * @param {...*} parameters - The injected parameters.
   * @returns {cache.services.CacheManager} The cache manager surrounded by a proxy.
   */


  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _CacheManagerProxy.default());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('database', _DatabaseDriver.default);
    this.addDriver('file', _FileDriver.default);
    this.addDriver('runtime', _RuntimeDriver.default);
  }
  /**
   * Resolve cache store by name.
   *
   * @param {string} [store] - The store name.
   * @returns {cache.services.CacheManager.drivers.Driver} The Driver instance.
   * @throws {TypeError} Indicates that the driver could not be resolved.
   */


  resolve(store) {
    if (!store) {
      return this.resolveDefault();
    }

    const {
      driver,
      ...config
    } = this.config.get(`cache.stores.${store}`, {});

    if (!driver) {
      throw new TypeError(`Cannot resolve driver for cache store [${store}]`);
    }

    return this.build(driver, {
      name: store,
      ...config
    });
  }
  /**
   * Resolve default store.
   *
   * @returns {cache.services.CacheManager.drivers.Driver} The default driver instance.
   */


  resolveDefault() {
    return this.resolve(this.config.get('cache.default', 'runtime'));
  }
  /**
   * Build store by driver name and by configuration.
   *
   * @param {string} driver - The driver name.
   * @param {object<string, *>} [config={}] - The driver configuration.
   * @returns {cache.services.CacheManager.drivers.Driver} The driver instance.
   */


  build(driver, config = {}) {
    const common = this.config.get('cache.common', {});
    return this.driver(driver, {
      'driver.config': { ...common,
        ...config
      }
    });
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return this.resolveDefault();
  }

}

var _default = CacheManager;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;