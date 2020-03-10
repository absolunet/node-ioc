"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpError = _interopRequireDefault(require("./HttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Method Not Allowed HTTP Error
//--------------------------------------------------------

/**
 * Method not allowed HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class MethodNotAllowedHttpError extends _HttpError.default {
  /**
   * MethodNotAllowedHttpError constructor.
   *
   * @param {...*} parameters - The error parameters.
   */
  constructor(...parameters) {
    super(405, ...parameters);
    this.name = 'MethodNotAllowedHttpError';
  }

}

var _default = MethodNotAllowedHttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;