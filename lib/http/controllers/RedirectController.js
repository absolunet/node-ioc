//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------
'use strict';

const Controller = require('./Controller');


class RedirectController extends Controller {

	/**
	 * Handle redirection.
	 *
	 * @param {{to: string, permanent: boolean}} defaults
	 * @returns {response}
	 */
	handle({ to, permanent }) {
		return this.redirect(to, permanent);
	}

}

module.exports = RedirectController;
