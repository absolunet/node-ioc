//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const GenericClass = require('./concerns/GenericClass');


module.exports = (SuperClass = GenericClass) => {

	return class HasDriverMixin extends SuperClass {

		static get dependencies() {
			return ['app'];
		}

		constructor(app, ...args) {
			super(...args);
			__(this).set('app', app);
			__(this).set('drivers', {});
		}

		/**
		 * Get loader driver by name.
		 *
		 * @param name
		 * @returns {Driver}
		 */
		driver(name = 'default') {
			const driver = __(this).get('drivers')[name];
			if (!driver) {
				throw new Error(`Driver [${name}] cannot be found.`);
			}

			return driver;
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

	};

};
