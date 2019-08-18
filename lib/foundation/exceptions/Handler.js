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
	 */
	async handle(exception) {
		__(this).get('exceptions').push(exception);

		try {
			await this.report(exception);
		} catch (error) {
			__(this).get('exceptions').push(error);
		}

		let terminal;

		try {
			terminal = this.app.make('terminal');
		} catch (error) {
			terminal = console;
		}

		terminal.error(exception.stack || exception);
	}

	/**
	 * Report an exception.
	 *
	 * @param {Error|string} exception
	 */
	async report(exception) {
		if (this.app.isBound('log')) {
			await this.app.make('log').error(exception.stack);
		}
	}

	/**
	 * Render an exception.
	 *
	 * @param {Error|string} exception
	 * @param {request} request
	 * @param {response} response
	 * @returns {response}
	 */
	render(exception, request, response) {
		if (exception instanceof TypeError && exception.message === 'Timeout') {
			response.status(408);
		} else {
			response.status(500);
		}

		return response.send(`<pre>${exception.message}\n\n${exception.stack}</pre>`);
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
