"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _forwardsCalls = _interopRequireDefault(require("../mixins/forwardsCalls"));

var _BaseProxy = _interopRequireDefault(require("./BaseProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Proxies - Base Proxy
//--------------------------------------------------------

/**
 * Proxy that forwards calls to a forwarded instance if property is not found in the instance.
 *
 * @memberof support.proxies
 * @augments support.mixins.ForwardsCalls
 * @augments support.proxies.BaseProxy
 * @hideconstructor
 */
class ForwardProxy extends (0, _forwardsCalls.default)(_BaseProxy.default) {
  /**
   * @inheritdoc
   */
  get(object, property) {
    const value = super.get(object, property);

    if (typeof value === 'undefined' && property !== 'init') {
      const forward = (0, _privateRegistry.default)(this).get('has')(object, 'getForward') ? object.getForward() : this.getForward(object);
      const forwardedValue = forward[property];

      if (typeof forwardedValue === 'function') {
        return Function.prototype.bind.call(forwardedValue, forward);
      }

      return forwardedValue;
    }

    return value;
  }

}

var _default = ForwardProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;