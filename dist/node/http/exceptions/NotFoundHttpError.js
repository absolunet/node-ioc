"use strict";

exports.default = void 0;

var _HttpError = _interopRequireDefault(require("./HttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Not Found HTTP Error
//--------------------------------------------------------

/**
 * Not found HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class NotFoundHttpError extends _HttpError.default {
  /**
   * NotFOundHttpError constructor.
   *
   * @param {...*} parameters - The error parameters.
   */
  constructor(...parameters) {
    super(404, ...parameters);
    this.name = 'NotFoundHttpError';
  }

}

var _default = NotFoundHttpError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;