//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------
'use strict';

const Controller = require('./Controller');
/**
 * Controller that handles redirection.
 *
 * @memberof http.controllers
 * @augments http.controllers.Controller
 * @hideconstructor
 */


class RedirectController extends Controller {
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

module.exports = RedirectController;