//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Timeout HTTP Error
//--------------------------------------------------------

import HttpError from './HttpError';


/**
 * Timeout HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class TimeoutHttpError extends HttpError {

	/**
	 * FTimeoutHttpError constructor.
	 *
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(...parameters) {
		super(408, ...parameters);
		this.name = 'TimeoutHttpError';
	}

}


export default TimeoutHttpError;
