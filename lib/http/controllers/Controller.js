//--------------------------------------------------------
//-- Node IoC - HTTP - Controller - Controller
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Controller {

	/**
	 * Prepare request handling.
	 *
	 * @param request
	 * @param response
	 */
	prepareHandling(request, response) {
		__(this).set('request', request);
		__(this).set('response', response);
	}

	/**
	 * Express request.
	 *
	 * @type {request}
	 */
	get request() {
		return __(this).get('request');
	}

	/**
	 * Express response.
	 *
	 * @type response
	 */
	get response() {
		return __(this).get('response');
	}

	/**
	 * Send JSON response.
	 *
	 * @param {string|number|boolean|object} object
	 * @returns {response}
	 */
	json(object) {
		return this.response.json(object);
	}

	/**
	 * Redirect to the given URL with the appropriate redirection code.
	 *
	 * @param {string} to
	 * @param {boolean} [permanent]
	 * @returns {response}
	 */
	redirect(to, permanent = false) {
		return this.response.redirect(permanent ? 301 : 302, to);
	}

}

module.exports = Controller;
