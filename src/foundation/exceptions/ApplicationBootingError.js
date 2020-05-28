//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Application Booting Error
//--------------------------------------------------------


/**
 * Error indicating that the application failed to boot properly.
 *
 * @memberof foundation.exceptions
 * @augments Error
 */
class ApplicationBootingError extends Error {

	/**
	 * ApplicationBootingError constructor.
	 *
	 * @param {Error} error - The booting error.
	 */
	constructor(error) {
		super('An exception was thrown while the application was booting.');
		this.stack += `\n\nCaused by:\n${error.stack}`;
		this.name  = 'ApplicationBootingError';
		this.error = error;
	}

}


export default ApplicationBootingError;
