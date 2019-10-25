//--------------------------------------------------------
//-- Node IoC - HTTP - Services - HttpErrorMapper
//--------------------------------------------------------

import HttpError                 from '../exceptions/HttpError';
import BadRequestHttpError       from '../exceptions/BadRequestHttpError';
import UnauthorizedHttpError     from '../exceptions/UnauthorizedHttpError';
import ForbiddenHttpError        from '../exceptions/ForbiddenHttpError';
import NotFoundHttpError         from '../exceptions/NotFoundHttpError';
import MethodNotAllowedHttpError from '../exceptions/MethodNotAllowedHttpError';
import TimeoutHttpError          from '../exceptions/TimeoutHttpError';


/**
 * HTTP errors helper that maps error with HTTP status code.
 *
 * @memberof http.services
 */
class HttpErrorMapper {

	/**
	 * Get an error class based on HTTP status code.
	 *
	 * @param {number} status - The HTTP status code.
	 * @returns {http.exceptions.HttpError} The HTTP error class.
	 */
	getErrorFromHttpStatus(status) {
		const { error } = this.getHttpErrorMapping()[status] || { error: HttpError };

		return error;
	}

	/**
	 * Get an error instance based on HTTP status code.
	 *
	 * @param {number} status - The HTTP status code.
	 * @param {string} [message] - The error message.
	 * @param {...*} parameters - The error parameters.
	 * @returns {http.exceptions.HttpError} The HTTP error instance.
	 */
	getErrorInstanceFromHttpStatus(status, message, ...parameters) {
		const errorData = this.getHttpErrorMapping()[status];

		if (errorData) {
			const { message: defaultMessage, error: HttpErrorConstructor } = errorData;

			return new HttpErrorConstructor(message || defaultMessage, ...parameters);
		}

		return new HttpError(status, message, ...parameters);
	}

	/**
	 * Get default message based on HTTP status code.
	 *
	 * @param {number} status - The HTTP status code.
	 * @returns {string} The default HTTP status message.
	 */
	getDefaultMessageFromHttpStatus(status) {
		return (this.getHttpErrorMapping()[status] || {}).message || '';
	}

	/**
	 * Get all HTTP error mapped with the appropriate HTTP status code.
	 *
	 * @returns {object<number, object<string, string|HttpError>>} The HTTP error mapping.
	 */
	getHttpErrorMapping() {
		return {
			400: {
				error:   BadRequestHttpError,
				message: 'Bad Request.'
			},
			401: {
				error:   UnauthorizedHttpError,
				message: 'Unauthorized.'
			},
			403: {
				error:   ForbiddenHttpError,
				message: 'Forbidden.'
			},
			404: {
				error:   NotFoundHttpError,
				message: 'Not Found.'
			},
			405: {
				error:   MethodNotAllowedHttpError,
				message: 'Method Not Allowed.'
			},
			408: {
				error:   TimeoutHttpError,
				message: 'Timeout.'
			}
		};
	}

}


export default HttpErrorMapper;
