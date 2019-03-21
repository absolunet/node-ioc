//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Concerns - Define mixin
//--------------------------------------------------------
'use strict';


const GenericClass = require('./GenericClass');

/**
 * Mixin factory.
 *
 * @param {function} callback
 * @returns {function(*=)}
 */
const factory = (callback) => {
	return (SuperClass = GenericClass) => {
		return callback(SuperClass);
	}
};

module.exports = factory;
