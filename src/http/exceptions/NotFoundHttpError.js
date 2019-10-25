//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - Not Found HTTP Error
//--------------------------------------------------------

import HttpError from './HttpError';


/**
 * Not found HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class NotFoundHttpError extends HttpError {

	/**
	 * NotFOundHttpError constructor.
	 *
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(...parameters) {
		super(404, ...parameters);
		this.name = 'NotFoundHttpError';
	}

}


export default NotFoundHttpError;
