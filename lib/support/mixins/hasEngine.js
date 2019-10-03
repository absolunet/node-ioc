//--------------------------------------------------------
//-- Node IoC - Support - Mixins - Has engine
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const factory = require('./concerns/mixinFactory');


const hasEngine = factory((SuperClass) => {
	return class HasEngineMixin extends SuperClass {

		/**
		 * Set current engine.
		 *
		 * @param engine
		 * @returns {this}
		 */
		setEngine(engine) {
			__(this).set('engine', engine);

			return this;
		}

		/**
		 * Current engine accessor.
		 *
		 * @type {*}
		 */
		get engine() {
			return __(this).get('engine');
		}

	};
});


module.exports = hasEngine;
