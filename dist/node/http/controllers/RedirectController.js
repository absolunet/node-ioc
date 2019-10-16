"use strict";

exports.default = void 0;

var _Controller = _interopRequireDefault(require("./Controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------

/**
 * Controller that handles redirection.
 *
 * @memberof http.controllers
 * @augments http.controllers.Controller
 * @hideconstructor
 */
class RedirectController extends _Controller.default {
  /**
   * Handle redirection.
   *
   * @param {{to: string, permanent: boolean}} defaults - The default values.
   * @returns {response} - The current response instance.
   */
  handle({
    to,
    permanent
  }) {
    return this.redirect(to, permanent);
  }

}

var _default = RedirectController;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;