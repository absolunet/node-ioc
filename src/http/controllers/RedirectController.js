//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------

import Controller from './Controller';


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
	 * @returns {*} The response.
	 */
	handle({ to, permanent }) {
		return this.redirect(to, permanent);
	}

}


export default RedirectController;
