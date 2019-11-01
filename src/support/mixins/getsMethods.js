//--------------------------------------------------------
//-- Node IoC - Foundation - Mixins - Get Methods
//--------------------------------------------------------

import factory from './concerns/mixinFactory';


/**
 * Gets methods mixin.
 *
 * @class
 * @name GetsMethod
 * @memberof support.mixins
 * @hideconstructor
 */
const getsMethods = factory((SuperClass) => {

	/**
	 * Gets methods mixin.
	 */
	return class GetsMethodsMixin extends SuperClass {

		/**
		 * Get all instance methods.
		 *
		 * @param {object} instance - The instance.
		 * @returns {Array<string>} List of all instance methods.
		 * @memberof support.mixins.GetsMethods
		 * @instance
		 */
		getMethods(instance) {
			const properties  = new Set();
			let currentObject = instance;

			do {
				Object.keys(Object.getOwnPropertyDescriptors(currentObject)).forEach((name) => {
					properties.add(name);
				});
				currentObject = Object.getPrototypeOf(currentObject);
			} while (currentObject && currentObject !== Object.prototype);

			return [...properties.keys()].sort();
		}

	};

});


export default getsMethods;
