//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store Resolver
//--------------------------------------------------------
'use strict';

const forwardCalls      = require('../../../support/mixins/forwardCalls');
const hasDriver         = require('../../../support/mixins/hasDriver');
const CacheManagerProxy = require('./CacheManagerProxy');

const DatabaseDriver    = require('./drivers/DatabaseDriver');
const FileDriver        = require('./drivers/FileDriver');
const RuntimeDriver     = require('./drivers/RuntimeDriver');


class CacheManager extends forwardCalls(hasDriver()) {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'config'];
	}

	/**
	 * CacheManager constructor.
	 *
	 * @param parameters
	 * @returns {CacheManager}
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new CacheManagerProxy());
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();

		this.addDriver('database', DatabaseDriver);
		this.addDriver('file',     FileDriver);
		this.addDriver('runtime',  RuntimeDriver);
	}

	/**
	 * Resolve cache store by name.
	 *
	 * @param {string} [store]
	 * @returns {Driver}
	 */
	resolve(store) {
		if (!store) {
			return this.resolveDefault();
		}

		const { driver, ...config } = this.config.get(`cache.stores.${store}`, {});

		if (!driver) {
			throw new TypeError(`Cannot resolve driver for cache store [${store}]`);
		}

		return this.build(driver, {
			name: store,
			...config
		});
	}

	/**
	 * Resolve default store.
	 *
	 * @returns {Driver}
	 */
	resolveDefault() {
		return this.resolve(this.config.get('cache.default', 'runtime'));
	}

	/**
	 * Build store by driver name and by configuration.
	 *
	 * @param {string} driver
	 * @param {object<string, *>} [config={}]
	 * @returns {Driver}
	 */
	build(driver, config = {}) {
		const common = this.config.get('cache.common', {});

		return this.driver(driver, {
			'driver.config': {
				...common,
				...config
			}
		});
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return this.resolveDefault();
	}

}


module.exports = CacheManager;
