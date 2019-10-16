//--------------------------------------------------------
//-- Node IoC - Console - Interceptors - Capture Interceptor
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Interceptor that captures the output and make it available for reuse by other instances.
 *
 * @memberof console.interceptors
 * @hideconstructor
 */
class CaptureInterceptor {

	/**
	 * @inheritdoc
	 * @private
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
	 * @returns {CaptureInterceptor} - The Capture interceptor instance.
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


export default CaptureInterceptor;
