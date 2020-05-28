"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Application Booting Error
//--------------------------------------------------------

/**
 * Error indicating that the application failed to boot properly.
 *
 * @memberof foundation.exceptions
 * @augments Error
 */
class ApplicationBootingError extends Error {
  /**
   * ApplicationBootingError constructor.
   *
   * @param {Error} error - The booting error.
   */
  constructor(error) {
    super('An exception was thrown while the application was booting.');
    this.stack += `\n\nCaused by:\n${error.stack}`;
    this.name = 'ApplicationBootingError';
    this.error = error;
  }

}

var _default = ApplicationBootingError;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;