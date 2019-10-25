//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Forbidden HTTP Error
//--------------------------------------------------------

import HttpError from './HttpError';


/**
 * Forbidden HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class ForbiddenHttpError extends HttpError {

	/**
	 * ForbiddenHttpError constructor.
	 *
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(...parameters) {
		super(403, ...parameters);
		this.name = 'ForbiddenHttpError';
	}

}


export default ForbiddenHttpError;
