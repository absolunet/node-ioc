"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hasEngine = _interopRequireDefault(require("../../../../support/mixins/hasEngine"));

var _NotImplementedError = _interopRequireDefault(require("../../NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler - Drivers - Driver
//--------------------------------------------------------

/**
 * Abstract exception handler driver that defines all the methods to be implemented.
 *
 * @abstract
 * @memberof foundation.exception.Handler.drivers
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class Driver extends (0, _hasEngine.default)() {
  /**
   * Render the exception in the response.
   *
   * @param {Error} exception - The exception to render.
   * @param {request} [request] - The current request.
   * @param {response} [response] - The current response.
   * @returns {Promise|void} The async process promise, if async.
   * @async
   * @abstract
   */
  render(exception, request, response) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'render');
  }
  /**
   * Check if request wants JSON response.
   *
   * @param {request} request - The current request instance.
   * @returns {boolean} Indicates that the request wants JSON response.
   */


  wantsJson(request) {
    return request && (/application\/json/u.test(request.get('accept')) || /xmlhttprequest/iu.test(request.get('x-requested-with')));
  }
  /**
   * Return a JSON renderable object that represents the exception.
   *
   * @param {Error} exception - The current exception.
   * @returns {{type: *, message: *}} - The renderable object.
   */


  renderJson(exception) {
    return {
      type: exception.name,
      message: exception.message
    };
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;