"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Proxies - Base Proxy
//--------------------------------------------------------

/**
 * Base proxy handler.
 *
 * @memberof support.proxies
 * @hideconstructor
 */
class BaseProxy {
  /**
   * ConnectorProxy constructor.
   */
  constructor() {
    (0, _privateRegistry.default)(this).set('has', (object, property) => {
      const inPrototype = Object.prototype.hasOwnProperty.call(object.constructor.prototype, property);
      const inInstance = Object.prototype.hasOwnProperty.call(object, property);
      return inPrototype || inInstance || Boolean(object[property]);
    });
  }
  /**
   * Property accessor.
   *
   * @param {object} object - Proxied object.
   * @param {string} property - The property name.
   * @returns {*} The property value.
   */


  get(object, property) {
    if (property === '__instance') {
      return object;
    }

    if ((0, _privateRegistry.default)(this).get('has')(object, property)) {
      const value = object[property];

      if (typeof value === 'function' && property !== 'constructor') {
        return value.bind(object);
      }

      return value;
    }

    if (typeof property === 'symbol') {
      return object[property];
    }

    return undefined;
  }

}

var _default = BaseProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;