//--------------------------------------------------------
//-- Node IoC - Support - Mixins - Has engine
//--------------------------------------------------------
'use strict';

const __      = require('@absolunet/private-registry');
const factory = require('./concerns/mixinFactory');


/**
 * Has engine mixin.
 *
 * @class
 * @name HasEngine
 * @memberof support.mixins
 * @hideconstructor
 */
const hasEngine = factory((SuperClass) => {

	/**
	 * Has engine mixin.
	 */
	return class HasEngineMixin extends SuperClass {

		/**
		 * Set current engine.
		 *
		 * @param {*} engine - The engine instance.
		 * @returns {HasEngine} - The current instance.
		 * @memberof support.mixins.HasEngine
		 * @instance
		 */
		setEngine(engine) {
			__(this).set('engine', engine);

			return this;
		}

		/**
		 * Current engine accessor.
		 *
		 * @type {*}
		 * @memberof support.mixins.HasEngine
		 * @instance
		 */
		get engine() {
			return __(this).get('engine');
		}

	};

});


module.exports = hasEngine;
