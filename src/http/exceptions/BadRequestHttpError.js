//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Bad request HTTP Error
//--------------------------------------------------------

import HttpError from './HttpError';


/**
 * Bad request HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class BadRequestHttpError extends HttpError {

	/**
	 * ForbiddenHttpError constructor.
	 *
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(...parameters) {
		super(400, ...parameters);
		this.name = 'BadRequestHttpError';
	}

}


export default BadRequestHttpError;
