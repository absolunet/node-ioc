//--------------------------------------------------------
//-- Node IoC - Support - Mixins - Has engine
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const factory = require('./concerns/mixinFactory');


module.exports = factory((SuperClass) => {
	return class HasEngine extends SuperClass {

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
		 * @returns {*}
		 */
		get engine() {
			return __(this).get('engine');
		}

	};
});
