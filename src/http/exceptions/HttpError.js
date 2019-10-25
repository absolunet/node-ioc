//--------------------------------------------------------
//-- Node IoC - HTTP - Exceptions - HTTP Error
//--------------------------------------------------------


/**
 * Abstract HTTP error.
 *
 * @memberof http.exceptions
 * @augments Error
 */
class HttpError extends Error {

	/**
	 * HttpError constructor.
	 *
	 * @param {number} status - The HTTP status code.
	 * @param {...*} parameters - The error parameters.
	 */
	constructor(status, ...parameters) {
		super(...parameters);
		this.name = 'HttpError';
		this.status = status;
	}

}


export default HttpError;
