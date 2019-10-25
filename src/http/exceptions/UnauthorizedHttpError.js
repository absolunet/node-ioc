//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Unauthorized HTTP Error
//--------------------------------------------------------

import HttpError from './HttpError';


/**
 * Unauthorized HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class UnauthorizedHttpError extends HttpError {

	/**
	 * UnauthorizedHttpError constructor.
	 *
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(...parameters) {
		super(401, ...parameters);
		this.name = 'UnauthorizedHttpError';
	}

}


export default UnauthorizedHttpError;
