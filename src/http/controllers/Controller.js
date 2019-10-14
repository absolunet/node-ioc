//--------------------------------------------------------
//-- Node IoC - HTTP - Controller - Controller
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


/**
 * Abstract controller class that describes all the shortcuts to take action on the response object.
 *
 * @memberof http.controllers
 * @abstract
 * @hideconstructor
 */
class Controller {

	/**
	 * Prepare request handling.
	 *
	 * @param {Container} app - The current container instance.
	 * @param {request} request - The current request instance.
	 * @param {response} response - The current response instance.
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
	 * @param {string} view - The view name.
	 * @param {*} data - The view-model data.
	 * @returns {response} - The response instance.
	 */
	view(view, data = {}) {
		return this.response
			.type('html')
			.send(this.app.make('view').make(view, data));
	}

	/**
	 * Send JSON response.
	 *
	 * @param {string|number|boolean|object} object - The JSON value to send.
	 * @returns {response} - The response instance.
	 */
	json(object) {
		return this.response.json(object);
	}

	/**
	 * Send a stream response.
	 * Ends the request when the handler resolves.
	 *
	 * @param {Function} handler - The stream handler.
	 * @returns {Promise<Response>} - The async process promise.
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
	 * @param {string} line - The line to stream into the response.
	 * @returns {Controller} - The current controller instance.
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
	 * @param {string|Array<string>} command - The command string.
	 * @returns {Promise<Response>} - The async process promise.
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
	 * @param {string|Array<string>} command - The command string.
	 * @param {Function|null} [handler] - The handler that will received printed data after command will have run.
	 * @returns {Promise} - The async process promise.
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
	 * @param {string} to - The URL to redirect to.
	 * @param {boolean} [permanent=false] - Indicates that the redirection response should flag a permanent redirection.
	 * @returns {response} - The current response instance.
	 */
	redirect(to, permanent = false) {
		return this.response.redirect(permanent ? 301 : 302, to);
	}

	/**
	 * Redirect to the given URL permanently.
	 *
	 * @param {string} to - The URL to redirect to.
	 * @returns {response} - The current response instance.
	 */
	permanentRedirect(to) {
		return this.redirect(to, true);
	}

	/**
	 * Set response status.
	 *
	 * @param {number} status - The HTTP status code.
	 * @returns {Controller} - The current controller instance.
	 */
	status(status) {
		this.response.status(status);

		return this;
	}

	/**
	 * Set 200 OK status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	ok() {
		return this.status(200);
	}

	/**
	 * Set 201 Created status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	created() {
		return this.status(201);
	}

	/**
	 * Set 202 Accepted status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	accepted() {
		return this.status(202);
	}

	/**
	 * Set 204 No Content status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	noContent() {
		return this.status(204);
	}

	/**
	 * Set 400 Bad Request status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	badRequest() {
		return this.status(400);
	}

	/**
	 * Set 401 Unauthorized status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	unauthorized() {
		return this.status(401);
	}

	/**
	 * Set 403 Forbidden status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	forbidden() {
		return this.status(403);
	}

	/**
	 * Set 404 Not Found status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	notFound() {
		return this.status(404);
	}

	/**
	 * Set 405 Method Not Allowed status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	methodNotAllowed() {
		return this.status(405);
	}

	/**
	 * Set 408 Timeout status.
	 *
	 * @returns {Controller} - The current controller instance.
	 */
	timeout() {
		return this.status(408);
	}

	/**
	 * Set 418 I'm A Teapot status.
	 *
	 * @returns {Controller} - The current controller instance.
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
	 * Indicates if the response is currently streaming.
	 *
	 * @type {boolean}
	 */
	get isStreaming() {
		return __(this).get('isStreaming');
	}

	/**
	 * Container.
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
	 * @type {response}
	 */
	get response() {
		return __(this).get('response');
	}

}

module.exports = Controller;
