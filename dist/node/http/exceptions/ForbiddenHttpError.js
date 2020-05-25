"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpError = _interopRequireDefault(require("./HttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Forbidden HTTP Error
//--------------------------------------------------------

/**
 * Forbidden HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class ForbiddenHttpError extends _HttpError.default {
  /**
   * ForbiddenHttpError constructor.
   *
   * @param {...*} parameters - The error parameters.
   */
  constructor(...parameters) {
    super(403, ...parameters);
    this.name = 'ForbiddenHttpError';
  }

}

var _default = ForbiddenHttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;