//--------------------------------------------------------
//-- Node IoC - Foundation - Exception Handler
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Handler {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Handler initializer.
	 */
	init() {
		__(this).set('exceptions', []);
	}

	/**
	 * Handle the given exception.
	 *
	 * @param {Error|string} exception
	 * @param {request} [request]
	 * @param {response} [response]
	 */
	async handle(exception, request, response) {
		__(this).get('exceptions').push(exception);

		await this.report(exception);

		this.render(exception, request, response);
	}

	/**
	 * Report an exception.
	 *
	 * @param {Error|string} exception
	 */
	async report(exception) {
		if (this.app.isBound('log')) {
			try {
				await this.app.make('log').error(exception.stack);
			} catch (error) {
				this.handleReportException(error);
			}
		}
	}

	/**
	 * Render an exception.
	 *
	 * @param {Error|string} exception
	 * @param {request} [request]
	 * @param {response} [response]
	 * @returns {response|void}
	 */
	render(exception, request, response) {
		if (response && typeof response.send === 'function' && response.status === 'function') {
			return this.renderResponse(exception, request, response);
		}

		return this.renderConsole(exception);
	}

	/**
	 * Render an exception as an HTTP response.
	 *
	 * @param {Error|string} exception
	 * @param {request} request
	 * @param {response} response
	 * @returns {response}
	 */
	renderResponse(exception, request, response) {
		if (exception instanceof TypeError && exception.message === 'Timeout') {
			response.status(408);
		} else {
			response.status(500);
		}

		if ((/application\/json;/u).test(request.get('accept'))) {
			return response.json(exception);
		}

		return response.send(this.formatResponseContent(exception));
	}

	/**
	 * Render exception in console.
	 *
	 * @param {Error|string} exception
	 */
	renderConsole(exception) {
		this.terminal.error(this.formatConsoleContent(exception));
	}

	/**
	 * Handle a report exception.
	 *
	 * @param exception
	 */
	handleReportException(exception) {
		__(this).get('exceptions').push(exception);
		this.terminal.warning(this.formatConsoleContent(exception));
	}

	/**
	 * Format HTTP response exception message.
	 *
	 * @param {Error|string} exception
	 * @returns {string}
	 */
	formatResponseContent(exception) {
		let message = (exception || '').toString();

		if (exception instanceof Error) {
			message = `${exception.message}\n\n${exception.stack}`;
		}

		return `<pre>${message}</pre>`;
	}

	/**
	 * Format a console exception message.
	 *
	 * @param {Error|string} exception
	 * @returns {string}
	 */
	formatConsoleContent(exception) {
		return exception.stack || exception;
	}

	/**
	 * Terminal instance.
	 * If not bound into the container, make a rudimentary one.
	 *
	 * @type {Terminal|{warning: *, error: *}}
	 */
	get terminal() {
		if (this.app.isBound('terminal')) {
			return this.app.make('terminal');
		}

		/* eslint-disable no-console */
		return {
			error: console.error.bind(console),
			warning: console.warn.bind(console)
		};
		/* eslint-enable no-console */
	}

	/**
	 * Check if it has already handle an exception during the given request.
	 *
	 * @returns {boolean}
	 */
	get hadException() {
		return Boolean(this.lastException);
	}

	/**
	 * Last exception accessor.
	 *
	 * @type {Error|string}
	 */
	get lastException() {
		const exceptions = __(this).get('exceptions');

		return exceptions[exceptions.length - 1];
	}

	/**
	 * @type {Container}
	 */
	get app() {
		return __(this).get('app');
	}

}


module.exports = Handler;
