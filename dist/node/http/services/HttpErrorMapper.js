"use strict";

exports.default = void 0;

var _HttpError = _interopRequireDefault(require("../exceptions/HttpError"));

var _BadRequestHttpError = _interopRequireDefault(require("../exceptions/BadRequestHttpError"));

var _UnauthorizedHttpError = _interopRequireDefault(require("../exceptions/UnauthorizedHttpError"));

var _ForbiddenHttpError = _interopRequireDefault(require("../exceptions/ForbiddenHttpError"));

var _NotFoundHttpError = _interopRequireDefault(require("../exceptions/NotFoundHttpError"));

var _MethodNotAllowedHttpError = _interopRequireDefault(require("../exceptions/MethodNotAllowedHttpError"));

var _TimeoutHttpError = _interopRequireDefault(require("../exceptions/TimeoutHttpError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Services - HttpErrorMapper
//--------------------------------------------------------

/**
 * HTTP errors helper that maps error with HTTP status code.
 *
 * @memberof http.services
 */
class HttpErrorMapper {
  /**
   * Get an error class based on HTTP status code.
   *
   * @param {number} status - The HTTP status code.
   * @returns {http.exceptions.HttpError} The HTTP error class.
   */
  getErrorFromHttpStatus(status) {
    const {
      error
    } = this.getHttpErrorMapping()[status] || {
      error: _HttpError.default
    };
    return error;
  }
  /**
   * Get an error instance based on HTTP status code.
   *
   * @param {number} status - The HTTP status code.
   * @param {string} [message] - The error message.
   * @param {...*} parameters - The error parameters.
   * @returns {http.exceptions.HttpError} The HTTP error instance.
   */


  getErrorInstanceFromHttpStatus(status, message, ...parameters) {
    const errorData = this.getHttpErrorMapping()[status];

    if (errorData) {
      const {
        message: defaultMessage,
        error: HttpErrorConstructor
      } = errorData;
      return new HttpErrorConstructor(message || defaultMessage, ...parameters);
    }

    return new _HttpError.default(status, message, ...parameters);
  }
  /**
   * Get default message based on HTTP status code.
   *
   * @param {number} status - The HTTP status code.
   * @returns {string} The default HTTP status message.
   */


  getDefaultMessageFromHttpStatus(status) {
    return (this.getHttpErrorMapping()[status] || {}).message || '';
  }
  /**
   * Get all HTTP error mapped with the appropriate HTTP status code.
   *
   * @returns {object<number, object<string, string|HttpError>>} The HTTP error mapping.
   */


  getHttpErrorMapping() {
    return {
      400: {
        error: _BadRequestHttpError.default,
        message: 'Bad Request.'
      },
      401: {
        error: _UnauthorizedHttpError.default,
        message: 'Unauthorized.'
      },
      403: {
        error: _ForbiddenHttpError.default,
        message: 'Forbidden.'
      },
      404: {
        error: _NotFoundHttpError.default,
        message: 'Not Found.'
      },
      405: {
        error: _MethodNotAllowedHttpError.default,
        message: 'Method Not Allowed.'
      },
      408: {
        error: _TimeoutHttpError.default,
        message: 'Timeout.'
      }
    };
  }

}

var _default = HttpErrorMapper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;