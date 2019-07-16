//--------------------------------------------------------
//-- Node IoC - HTTP - Controller - Controller
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Controller {

	/**
	 * Prepare request handling.
	 *
	 * @param {Container} app
	 * @param {request} request
	 * @param {response} response
	 */
	prepareHandling(app, request, response) {
		__(this).set('app', app);
		__(this).set('request', request);
		__(this).set('response', response);
	}

	/**
	 * Send HTML response.
	 *
	 * @param {string} view
	 * @param {*} data
	 * @returns {string}
	 */
	view(view, data = {}) {
		return this.response
			.type('html')
			.send(__(this).get('app').make('view').make(view, data));
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

	async streamCommand(command) {
		const terminal         = this.app.make('terminal');
		const commandRegistrar = this.app.make('command.registrar');
		const interceptor      = this.app.make('terminal.interceptor');

		const handler = (content) => {
			this.response.write(`${content.trim()}\n`);
		};

		this.response.writeHead(200, {
			'Content-Type': 'text/plain',
			'Transfer-Encoding': 'chunked'
		});

		interceptor
			.add(handler)
			.mute();

		try {
			await commandRegistrar.resolve(command, true);
		} catch (error) {
			terminal.error(error);
		}

		interceptor
			.unmute()
			.remove(handler);

		return this.response.end();
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

	/**
	 * Set response status.
	 *
	 * @param {number} status
	 * @returns {Controller}
	 */
	status(status) {
		this.response.status(status);

		return this;
	}

	/**
	 * Set 401 Unauthorized status.
	 *
	 * @returns {Controller}
	 */
	unauthorized() {
		return this.status(401);
	}

	/**
	 * Set 403 Forbidden status.
	 *
	 * @returns {Controller}
	 */
	forbidden() {
		return this.status(403);
	}

	/**
	 * Set 404 Not Found status.
	 *
	 * @returns {Controller}
	 */
	notFound() {
		return this.status(404);
	}

	/**
	 * Application container.
	 *
	 * @type {Container}
	 */
	get app() {
		return __(this).get('app');
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

}

module.exports = Controller;
