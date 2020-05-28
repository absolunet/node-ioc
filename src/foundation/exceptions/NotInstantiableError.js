//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Not Instantiable Error
//--------------------------------------------------------


/**
 * Error that needs to be thrown when instantiating a class that is meant to be abstract.
 *
 * @memberof foundation.exceptions
 * @augments TypeError
 */
class NotInstantiableError extends TypeError {

	/**
	 * NotInstantiableError constructor.
	 *
	 * @param {string|Function} constructor - The constructor reference, or its name.
	 */
	constructor(constructor) {
		super(`Class [${typeof constructor === 'string' ? constructor : constructor.name}] is not instantiable.`);
		this.name = 'NotInstantiableError';
	}

}


export default NotInstantiableError;
