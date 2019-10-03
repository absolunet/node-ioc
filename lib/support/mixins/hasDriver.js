//--------------------------------------------------------
//-- Node IoC - Foundation - Mixins - Has driver
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const factory = require('./concerns/mixinFactory');


const hasDriver = factory((SuperClass) => {
	return class HasDriverMixin extends SuperClass {

		/**
		 * {@inheritdoc}
		 */
		static get dependencies() {
			return (super.dependencies || []).concat(['app']);
		}

		/**
		 * {@inheritdoc}
		 */
		init() {
			if (super.init) {
				super.init();
			}
			__(this).set('drivers', {});
			__(this).set('aliases', {});
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
				throw new TypeError(`Driver [${name}] cannot be found.`);
			}

			const data = __(this).get('drivers')[name];

			if (!data.concrete || Object.keys(parameters) > 0) {
				const concrete = this.app.make(data.abstract, parameters);

				if (!this.isAlias(name)) {
					this.bootDriver(concrete, name);
				}

				if (data.concrete || Object.keys(parameters).length > 0) {
					return concrete;
				}

				data.concrete = concrete;
			}

			return data.concrete;
		}

		/**
		 * Boot newly created driver.
		 *
		 * @param {*} driver
		 * @param {string} name
		 * @returns {*}
		 */
		bootDriver(driver) {
			return driver;
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
			__(this).get('aliases')[alias] = name;
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

		/**
		 * Check if given driver name is an alias.
		 *
		 * @param {string} name
		 * @returns {boolean}
		 */
		isAlias(name) {
			return Object.keys(__(this).get('aliases')).includes(name);
		}

	};
});


module.exports = hasDriver;
