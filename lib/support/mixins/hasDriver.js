//--------------------------------------------------------
//-- Node IoC - Foundation - Mixins - Has driver
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
			return (super.dependencies || []).concat(['app']);
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
		 * @param {string} [name="default"]
		 * @param {object} [parameters={}]
		 * @returns {Driver}
		 */
		driver(name = 'default', parameters = {}) {
			if (!this.hasDriver(name)) {
				throw new Error(`Driver [${name}] cannot be found.`);
			}

			const data = __(this).get('drivers')[name];

			if (!data.concrete || Object.keys(parameters) > 0) {
				const concrete = this.app.make(data.abstract, parameters);

				if (data.concrete) {
					return concrete;
				}

				data.concrete = concrete;
			}

			return data.concrete;
		}

		/**
		 * Add a driver and bind it with the given name.
		 *
		 * @param {string} name
		 * @param {Driver} driver
		 */
		addDriver(name, driver) {
			__(this).get('drivers')[name] = {
				'name':     name,
				'abstract': driver,
				'concrete': null
			};
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
			this.addDriver(alias, () => {
				return this.driver(name);
			});
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
