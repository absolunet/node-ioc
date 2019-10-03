//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Not Implemented Error
//--------------------------------------------------------
'use strict';


class NotImplementedError extends TypeError {

	constructor(instance, method, returnType, type = 'method') {
		const constructorName = instance && instance.constructor && instance.constructor !== Function ? instance.constructor.name || instance.constructor.toString() : instance.name || instance.toString();
		super(`The ${type} [${method}] must be implemented in [${constructorName}].${returnType ? ` It should return [${returnType}].` : ''}`);
		this.name = 'NotImplementedError';
	}

}


module.exports = NotImplementedError;
