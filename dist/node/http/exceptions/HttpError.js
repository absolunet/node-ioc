"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - HTTP Error
//--------------------------------------------------------

/**
 * Abstract HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class HttpError extends Error {
  /**
   * HttpError constructor.
   *
   * @param {number} status - The HTTP status code.
   * @param {...*} parameters - The error parameters.
   */
  constructor(status, ...parameters) {
    super(...parameters);
    this.name = 'HttpError';
    this.status = status;
  }

}

var _default = HttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;