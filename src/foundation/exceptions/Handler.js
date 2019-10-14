//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


/**
 * Main exception handler.
 *
 * @memberof foundation.exceptions
 * @hideconstructor
 */
class Handler {

	/**
	 * Class dependencies.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('exceptions', []);
	}

	/**
	 * Handle the given exception.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @param {request} [request] - The current HTTP request.
	 * @param {response} [response] - The current HTTP response.
	 * @returns {Promise} - The async process promise.
	 */
	async handle(exception, request, response) {
		__(this).get('exceptions').push(exception);

		await this.report(exception);

		this.render(exception, request, response);
	}

	/**
	 * Report an exception.
	 *
	 * @param {Error|string} exception - The exception to report.
	 * @returns {Promise} - The async process promise.
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
	 * @param {Error|string} exception - The handled exception.
	 * @param {request} [request] - The current HTTP request.
	 * @param {response} [response] - The current HTTP response.
	 */
	render(exception, request, response) {
		if (response && response.send && response.json && response.status) {
			this.renderResponse(exception, request, response);
		} else {
			this.renderConsole(exception);
		}
	}

	/**
	 * Render an exception as an HTTP response.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @param {request} [request] - The current HTTP request.
	 * @param {response} [response] - The current HTTP response.
	 */
	renderResponse(exception, request, response) {
		if (exception instanceof TypeError && exception.message === 'Timeout') {
			response.status(408);
		} else {
			response.status(500);
		}

		if ((/application\/json/u).test(request.get('accept'))) {
			response.json(exception);
		} else {
			response.send(this.formatResponseContent(exception));
		}
	}

	/**
	 * Render exception in console.
	 *
	 * @param {Error|string} exception - The handled exception.
	 */
	renderConsole(exception) {
		this.terminal.error(this.formatConsoleContent(exception));
	}

	/**
	 * Handle a report exception.
	 *
	 * @param {Error|string} exception - The report exception.
	 */
	handleReportException(exception) {
		__(this).get('exceptions').push(exception);
		this.terminal.warning(this.formatConsoleContent(exception));
	}

	/**
	 * Format HTTP response exception message.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @returns {string} - The formatted exception.
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
	 * @param {Error|string} exception - The handled exception.
	 * @returns {string} - The formatted exception.
	 */
	formatConsoleContent(exception) {
		return exception.stack || exception;
	}

	/**
	 * Terminal instance.
	 * If not bound into the container, make a rudimentary one.
	 *
	 * @type {{warning: Function, error: Function}}
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
	 * @type {boolean}
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

}


module.exports = Handler;
