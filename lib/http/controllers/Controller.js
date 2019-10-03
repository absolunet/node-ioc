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

		return this.stream(async () => {
			await this.runCommand(command, handler);
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

		if (handler) {
			interceptor.add(handler).mute();
		}

		await commandRegistrar.resolve(command, true);

		if (handler) {
			interceptor.unmute().remove(handler);
		}
	}

	/**
	 * Redirect to the given URL with the appropriate redirection code.
	 *
	 * @param {string} to
	 * @param {boolean} [permanent=false]
	 * @returns {response}
	 */
	redirect(to, permanent = false) {
		return this.response.redirect(permanent ? 301 : 302, to);
	}

	/**
	 * Redirect to the given URL permanently.
	 *
	 * @param {string} to
	 * @returns {response}
	 */
	permanentRedirect(to) {
		return this.redirect(to, true);
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
	 * Set 200 OK status.
	 *
	 * @returns {Controller}
	 */
	ok() {
		return this.status(200);
	}

	/**
	 * Set 201 Created status.
	 *
	 * @returns {Controller}
	 */
	created() {
		return this.status(201);
	}

	/**
	 * Set 202 Accepted status.
	 *
	 * @returns {Controller}
	 */
	accepted() {
		return this.status(202);
	}

	/**
	 * Set 204 No Content status.
	 *
	 * @returns {Controller}
	 */
	noContent() {
		return this.status(204);
	}

	/**
	 * Set 400 Bad Request status.
	 *
	 * @returns {Controller}
	 */
	badRequest() {
		return this.status(400);
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
	 * Set 405 Method Not Allowed status.
	 *
	 * @returns {Controller}
	 */
	methodNotAllowed() {
		return this.status(405);
	}

	/**
	 * Set 408 Timeout status.
	 *
	 * @returns {Controller}
	 */
	timeout() {
		return this.status(408);
	}

	/**
	 * Set 418 I'm A Teapot status.
	 *
	 * @returns {Controller}
	 */
	teapot() {
		return this.status(418);
	}

	/**
	 * Command streaming interceptor handler.
	 *
	 * @type {Function}
	 */
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
