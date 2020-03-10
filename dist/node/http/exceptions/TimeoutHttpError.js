"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpError = _interopRequireDefault(require("./HttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Timeout HTTP Error
//--------------------------------------------------------

/**
 * Timeout HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class TimeoutHttpError extends _HttpError.default {
  /**
   * FTimeoutHttpError constructor.
   *
   * @param {...*} parameters - The error parameters.
   */
  constructor(...parameters) {
    super(408, ...parameters);
    this.name = 'TimeoutHttpError';
  }

}

var _default = TimeoutHttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;