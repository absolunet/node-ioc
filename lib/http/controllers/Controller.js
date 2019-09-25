//--------------------------------------------------------
//-- Node IoC - HTTP - Controller - Controller
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

/* istanbul ignore next */
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
		__(this).set('isStreaming', false);
	}

	/**
	 * Send HTML response.
	 *
	 * @param {string} view
	 * @param {*} data
	 * @returns {response}
	 */
	view(view, data = {}) {
		return this.response
			.type('html')
			.send(this.app.make('view').make(view, data));
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
	 * Send a stream response.
	 * Ends the request when the handler resolves.
	 *
	 * @param {Function} handler
	 * @returns {Promise<Response>}
	 */
	async stream(handler) {
		__(this).set('isStreaming', true);
		this.response.writeHead(200, {
			'Content-Type': 'text/plain',
			'Transfer-Encoding': 'chunked'
		});

		await handler();

		return this.response.end();
	}

	/**
	 * Write line in the stream response.
	 *
	 * @param {string} line
	 * @returns {Controller}
	 */
	writeStreamLine(line) {
		if (this.isStreaming) {
			this.response.write(`${line}\n`);
		}

		return this;
	}

	/**
	 * Send a stream response from command output.
	 *
	 * @param {string|Array<string>} command
	 * @returns {Promise<Response>}
	 */
	streamCommand(command) {
		const { writeStreamLineHandler: handler } = this;

		return this.stream(() => {
			return this.runCommand(command, handler);
		});
	}

	/**
	 * Run command.
	 * Handle output if an handler is provided.
	 *
	 * @param {string|Array<string>} command
	 * @param {Function|null} [handler]
	 * @returns {Promise}
	 */
	async runCommand(command, handler = null) {
		const commandRegistrar = this.app.make('command.registrar');
		const interceptor      = this.app.make('terminal.interceptor');
		const terminal         = this.app.make('terminal');

		if (handler) {
			interceptor.add(handler).mute();
		}

		try {
			await commandRegistrar.resolve(command, true);
		} catch (error) {
			terminal.error(error);
		}

		if (handler) {
			interceptor.unmute().remove(handler);
		}
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

	get writeStreamLineHandler() {
		return (content) => {
			this.writeStreamLine(`${content.trim().replace(/\n$/u, '')}`);
		};
	}

	/**
	 * @type {boolean}
	 */
	get isStreaming() {
		return __(this).get('isStreaming');
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
