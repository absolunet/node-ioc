//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Method Not Allowed HTTP Error
//--------------------------------------------------------

import HttpError from './HttpError';


/**
 * Method not allowed HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class MethodNotAllowedHttpError extends HttpError {

	/**
	 * MethodNotAllowedHttpError constructor.
	 *
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(...parameters) {
		super(405, ...parameters);
		this.name = 'MethodNotAllowedHttpError';
	}

}


export default MethodNotAllowedHttpError;
