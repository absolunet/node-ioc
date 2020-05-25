"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _BaseProxy = _interopRequireDefault(require("../support/proxies/BaseProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Container - Proxy
//--------------------------------------------------------

/**
 * Container proxy that allows dynamic resolving without using container.make().
 *
 * @example
 * container.bind('foo', 'bar');
 * container.make('foo'); // "bar"
 * container.foo; // "bar"
 *
 * @memberof container
 * @augments support.proxies.BaseProxy
 * @hideconstructor
 */
class ContainerProxy extends _BaseProxy.default {
  /**
   * @inheritdoc
   */
  get(object, property) {
    const value = super.get(object, property);

    if (typeof value === 'undefined' && typeof property !== 'symbol') {
      try {
        return object.make(property);
      } catch (error) {// eslint-disable line-no-empty-block
      }
    }

    return value;
  }
  /**
   * Container property check handler.
   *
   * @param {container.Container} object - The current container.
   * @param {string} property - The property name.
   * @returns {boolean} Indicates that the property exists in the container or that the binding exists.
   */


  has(object, property) {
    return (0, _privateRegistry.default)(this).get('has')(object, property) || Boolean((0, _privateRegistry.default)(object).get('bindings')[property]) || object.isTag(property);
  }

}

var _default = ContainerProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;