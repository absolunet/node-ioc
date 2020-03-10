"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Interceptors - Capture Interceptor
//--------------------------------------------------------

/**
 * Interceptor that captures the output and make it available for reuse by other instances.
 *
 * @memberof console.interceptors
 * @hideconstructor
 */
class CaptureInterceptor {
  /**
   * @inheritdoc
   * @private
   */
  init() {
    const capture = [];
    (0, _privateRegistry.default)(this).set('capture', capture);
    (0, _privateRegistry.default)(this).set('handler', string => {
      capture.push(string.trim());
      return string;
    });
  }
  /**
   * Flush captured logs.
   *
   * @returns {console.interceptors.CaptureInterceptor} The Capture interceptor instance.
   */


  flush() {
    (0, _privateRegistry.default)(this).get('capture').splice(0);
    return this;
  }
  /**
   * Interceptor handler.
   *
   * @type {Function}
   */


  get handler() {
    return (0, _privateRegistry.default)(this).get('handler');
  }
  /**
   * Captured output.
   *
   * @type {Array<string>}
   */


  get capture() {
    return [...(0, _privateRegistry.default)(this).get('capture')];
  }

}

var _default = CaptureInterceptor;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;