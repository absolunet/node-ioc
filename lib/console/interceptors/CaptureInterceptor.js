//--------------------------------------------------------
//-- Node IoC - Console - Interceptors - Capture Interceptor
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class CaptureInterceptor {

	/**
	 * {@inheritdoc}
	 */
	init()  {
		const capture = [];
		__(this).set('capture', capture);
		__(this).set('handler', (string) => {
			capture.push(string.trim());

			return string;
		});
	}

	/**
	 * Flush captured logs.
	 *
	 * @returns {CaptureInterceptor}
	 */
	flush() {
		__(this).get('capture').splice(0);

		return this;
	}

	/**
	 * Interceptor handler.
	 *
	 * @type {Function}
	 */
	get handler() {
		return __(this).get('handler');
	}

	/**
	 * Captured output.
	 *
	 * @type {Array<string>}
	 */
	get capture() {
		return [...__(this).get('capture')];
	}

}


module.exports = CaptureInterceptor;
