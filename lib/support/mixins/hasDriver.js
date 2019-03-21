//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const factory = require('./concerns/mixinFactory');


module.exports = factory((SuperClass) => {

	return class HasDriverMixin extends SuperClass {

		/**
		 * Dependencies descriptor.
		 *
		 * @returns {string[]}
		 */
		static get dependencies() {
			return ['app'];
		}

		/**
		 * HasDriver initializer.
		 */
		init() {
			if (super.init) {
				super.init();
			}
			__(this).set('drivers', {});
		}

		/**
		 * Get loader driver by name.
		 *
		 * @param name
		 * @returns {Driver}
		 */
		driver(name = 'default') {
			if (!this.hasDriver(name)) {
				throw new Error(`Driver [${name}] cannot be found.`);
			}

			return __(this).get('drivers')[name];
		}

		/**
		 * Add a driver and bind it with the given name.
		 *
		 * @param {string} name
		 * @param {Driver} driver
		 */
			addDriver(name, driver) {
			__(this).get('drivers')[name] = __(this).get('app').make(driver);
		}

		/**
		 * Set given driver name as the default driver.
		 *
		 * @param {string} name
		 */
		setDefaultDriver(name) {
			this.setDriverAlias(name, 'default');
		}

		/**
		 * Give driver an alias name.
		 *
		 * @param {string} name
		 * @param {string} alias
		 */
		setDriverAlias(name, alias) {
			this.addDriver(alias, this.driver(name));
		}

		/**
		 * Check if driver exists.
		 *
		 * @param  {string} name
		 * @returns {boolean}
		 */
		hasDriver(name) {
			return Boolean(__(this).get('drivers')[name]);
		}

	};

});
