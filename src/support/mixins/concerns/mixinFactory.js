//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Concerns - Define mixin
//--------------------------------------------------------

import GenericClass from './GenericClass';


/**
 * Mixin factory.
 *
 * @param {Function} callback - Mixin closure.
 * @returns {Function} Mixin.
 * @memberof support.mixins.concerns
 */
const factory = (callback) => {
	return (SuperClass = GenericClass) => {
		return callback(SuperClass);
	};
};


export default factory;
