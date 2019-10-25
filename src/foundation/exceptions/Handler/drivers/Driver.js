//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler - Drivers - Driver
//--------------------------------------------------------

import hasEngine from '../../../../support/mixins/hasEngine';
import NotImplementedError from '../../NotImplementedError';


/**
 * Abstract exception handler driver that defines all the methods to be implemented.
 *
 * @abstract
 * @memberof foundation.exception.Handler.drivers
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class Driver extends hasEngine() {

	/**
	 * Render the exception in the response.
	 *
	 * @param {Error} exception - The exception to render.
	 * @param {request} [request] - The current request.
	 * @param {response} [response] - The current response.
	 * @returns {Promise|void} The async process promise, if async.
	 * @async
	 * @abstract
	 */
	render(exception, request, response) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'render');
	}

	/**
	 * Check if request wants JSON response.
	 *
	 * @param {request} request - The current request instance.
	 * @returns {boolean} Indicates that the request wants JSON response.
	 */
	wantsJson(request) {
		return request && ((/application\/json/u).test(request.get('accept')) || (/xmlhttprequest/iu).test(request.get('x-requested-with')));
	}

}


export default Driver;
