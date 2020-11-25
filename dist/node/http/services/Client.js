"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Client
//--------------------------------------------------------

/**
 * HTTP client.
 *
 * @memberof http.services
 * @hideconstructor
 */
class Client {
  /**
   * HTTP Client constructor.
   */
  constructor() {
    return require('axios'); // eslint-disable-line global-require
  }

}

var _default = Client;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;