"use strict";

exports.default = void 0;

var _SyncProxy = _interopRequireDefault(require("./SyncProxy"));

var _forwardCalls = _interopRequireDefault(require("../../../support/mixins/forwardCalls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Sync
//--------------------------------------------------------

/**
 * The sync file system.
 *
 * @memberof file.systems
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */
class Sync extends (0, _forwardCalls.default)() {
  /**
   * Sync constructor.
   *
   * @param {...*} parameters - Injected parameters.
   * @returns {Sync} - The sync instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _SyncProxy.default());
  }
  /**
   * Replace searched content by replacement string.
   *
   * @param {string} file - File name or pattern.
   * @param {string|RegExp} search - The searched pattern.
   * @param {string} replace - The replacement value.
   * @param {object} [options] - The replace-in-file module options.
   */


  replaceInFile(file, search, replace, options = {}) {
    const flags = [...new Set([...(search.flags || '').split(''), 'g', 'u'])];
    const regex = new RegExp(search, flags.join(''));

    require('replace-in-file').sync({ // eslint-disable-line global-require
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
    return require('@absolunet/fss'); // eslint-disable-line global-require
  }

}

var _default = Sync;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;