"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _mixinFactory = _interopRequireDefault(require("./concerns/mixinFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------

/**
 * Has driver mixin.
 *
 * @class
 * @name HasDriver
 * @memberof support.mixins
 * @hideconstructor
 */
const hasDriver = (0, _mixinFactory.default)(SuperClass => {
  /**
   * Has driver mixin.
   */
  return class HasDriverMixin extends SuperClass {
    /**
     * Class dependencies: <code>['app']</code>.
     *
     * @type {Array<string>}
     * @ignore
     */
    static get dependencies() {
      return (super.dependencies || []).concat(['app']);
    }
    /**
     * @inheritdoc
     * @private
     */


    init() {
      if (super.init) {
        super.init();
      }

      (0, _privateRegistry.default)(this).set('drivers', {});
      (0, _privateRegistry.default)(this).set('aliases', {});
    }
    /**
     * Get loader driver by name.
     *
     * @param {string} [name="default"] - The driver name.
     * @param {object} [parameters={}] - The additional parameters to inject into the driver instance.
     * @returns {object} The resolved driver instance.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    driver(name = 'default', parameters = {}) {
      if (!this.hasDriver(name)) {
        throw new TypeError(`Driver [${name}] cannot be found.`);
      }

      const data = (0, _privateRegistry.default)(this).get('drivers')[name];

      if (!data.concrete || Object.keys(parameters) > 0) {
        const concrete = this.app.make(data.abstract, parameters);

        if (!this.isDriverAlias(name)) {
          this.bootDriver(concrete, name);
        }

        if (data.concrete || Object.keys(parameters).length > 0) {
          return concrete;
        }

        data.concrete = concrete;
      }

      return data.concrete;
    }
    /**
     * Boot newly created driver.
     *
     * @param {*} driver - The driver instance.
     * @param {string} name - The driver name.
     * @returns {*} The driver instance.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    bootDriver(driver, name) {
      // eslint-disable-line no-unused-vars
      return driver;
    }
    /**
     * Add a driver and bind it with the given name.
     *
     * @param {string} name - The driver name.
     * @param {Function} driver - The driver class or factory.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    addDriver(name, driver) {
      (0, _privateRegistry.default)(this).get('drivers')[name] = {
        name,
        'abstract': driver,
        'concrete': null
      };
    }
    /**
     * Set given driver name as the default driver.
     *
     * @param {string} name - The driver name.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    setDefaultDriver(name) {
      this.setDriverAlias(name, 'default');
    }
    /**
     * Give driver an alias name.
     *
     * @param {string} name - The driver name.
     * @param {string} alias - The driver alias.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    setDriverAlias(name, alias) {
      this.addDriver(alias, (app, parameters) => {
        return this.driver(name, parameters);
      });
      (0, _privateRegistry.default)(this).get('aliases')[alias] = name;
    }
    /**
     * Check if driver exists.
     *
     * @param  {string} name - The driver name.
     * @returns {boolean} Indicates that the driver exists.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    hasDriver(name) {
      return Boolean((0, _privateRegistry.default)(this).get('drivers')[name]);
    }
    /**
     * Check if given driver name is an alias.
     *
     * @param {string} name - The driver alias name.
     * @returns {boolean} Indicates that the alias exists.
     * @memberof support.mixins.HasDriver
     * @instance
     */


    isDriverAlias(name) {
      return Object.keys((0, _privateRegistry.default)(this).get('aliases')).includes(name);
    }

  };
});
var _default = hasDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;