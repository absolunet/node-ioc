"use strict";

exports.default = void 0;

var _HttpError = _interopRequireDefault(require("./HttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Unauthorized HTTP Error
//--------------------------------------------------------

/**
 * Unauthorized HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class UnauthorizedHttpError extends _HttpError.default {
  /**
   * UnauthorizedHttpError constructor.
   *
   * @param {...*} parameters - The error parameters.
   */
  constructor(...parameters) {
    super(401, ...parameters);
    this.name = 'UnauthorizedHttpError';
  }

}

var _default = UnauthorizedHttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;