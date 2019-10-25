"use strict";

exports.default = void 0;

var _AsyncProxy = _interopRequireDefault(require("./AsyncProxy"));

var _forwardCalls = _interopRequireDefault(require("../../../support/mixins/forwardCalls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async
//--------------------------------------------------------

/**
 * The async file system.
 *
 * @memberof file.systems
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class Async extends (0, _forwardCalls.default)() {
  /**
   * Async constructor.
   *
   * @param {...*} parameters - Injected parameters.
   * @returns {file.system.Async} The async instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _AsyncProxy.default());
  }
  /**
   * Replace searched content by replacement string.
   *
   * @param {string} file - File name or pattern.
   * @param {string|RegExp} search - The searched pattern.
   * @param {string} replace - The replacement value.
   * @param {object} [options] - The replace-in-file module options.
   * @returns {Promise} The async process promise.
   */


  async replaceInFile(file, search, replace, options = {}) {
    const flags = [...new Set([...(search.flags || '').split(''), 'g', 'u'])];
    const regex = new RegExp(search, flags.join(''));
    await require('replace-in-file')({ // eslint-disable-line global-require
      ...options,
      files: file,
      from: regex,
      to: replace
    });
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return require('@absolunet/fsp'); // eslint-disable-line global-require
  }

}

var _default = Async;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;