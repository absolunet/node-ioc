//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------
'use strict';

const Controller = require('./Controller');


class RedirectController extends Controller {

	/**
	 * Handle redirection.
	 *
	 * @param {request} request
	 * @param {{to: string, permanent: boolean}} defaults
	 * @returns {response}
	 */
	handle(request, { to, permanent }) {
		return this.redirect(to, permanent);
	}

}

module.exports = RedirectController;
