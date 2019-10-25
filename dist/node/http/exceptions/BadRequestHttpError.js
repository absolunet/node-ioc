"use strict";

exports.default = void 0;

var _HttpError = _interopRequireDefault(require("./HttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Bad request HTTP Error
//--------------------------------------------------------

/**
 * Bad request HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class BadRequestHttpError extends _HttpError.default {
  /**
   * ForbiddenHttpError constructor.
   *
   * @param {...*} parameters - The error parameters.
   */
  constructor(...parameters) {
    super(400, ...parameters);
    this.name = 'BadRequestHttpError';
  }

}

var _default = BadRequestHttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;