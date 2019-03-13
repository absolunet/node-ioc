//--------------------------------------------------------
//-- Node IoC - Foundation - Exception Handler
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');


class Handler {

	/**
	 * Exception handler constructor.
	 */
	constructor() {
		__(this).set('exceptions', []);
	}

	/**
	 * Handle the given exception.
	 *
	 * @param {Error|string} exception
	 */
	handle(exception) {
		__(this).get('exceptions').push(exception);
		this.render(exception);
	}

	/**
	 * Render an exception
	 *
	 * @param {Error|string} exception
	 */
	render(exception) {
		console.error(exception); // eslint-disable-line no-console
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
	 * @returns {Error|string}
	 */
	get lastException() {
		const exceptions = __(this).get('exceptions');

		return exceptions[exceptions.length - 1];
	}

}

module.exports = Handler;
