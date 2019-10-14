//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Not Implemented Error
//--------------------------------------------------------
'use strict';


/**
 * Error that needs to be thrown to simulate a method that was not implemented, such as would do a typed engine with interfaces or abstract methods.
 *
 * @memberof foundation.exceptions
 * @augments TypeError
 */
class NotImplementedError extends TypeError {

	/**
	 * NotImplementedError constructor.
	 *
	 * @param {*} instance - The current instance.
	 * @param {string} method - The method that was not implemented.
	 * @param {string} [returnType] - The expected return type.
	 * @param {string} [type="method"] - The method type, either "method", "accessor" or "mutator".
	 */
	constructor(instance, method, returnType, type = 'method') {
		const constructorName = instance && instance.constructor && instance.constructor !== Function ? instance.constructor.name || instance.constructor.toString() : instance.name || instance.toString();
		super(`The ${type} [${method}] must be implemented in [${constructorName}].${returnType ? ` It should return [${returnType}].` : ''}`);
		this.name = 'NotImplementedError';
	}

}


module.exports = NotImplementedError;
