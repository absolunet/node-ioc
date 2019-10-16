//--------------------------------------------------------
//-- Node IoC - Cache - Services - Store Resolver
//--------------------------------------------------------

import forwardCalls      from '../../../support/mixins/forwardCalls';
import hasDriver         from '../../../support/mixins/hasDriver';
import CacheManagerProxy from './CacheManagerProxy';
import DatabaseDriver    from './drivers/DatabaseDriver';
import FileDriver        from './drivers/FileDriver';
import RuntimeDriver     from './drivers/RuntimeDriver';


/**
 * Cache manager that uses the configuration to properly handle caching operation through drivers.
 *
 * @memberof cache.services
 * @augments support.mixins.ForwardCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class CacheManager extends forwardCalls(hasDriver()) {

	/**
	 * Class dependencies: <code>['app', 'config']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config']);
	}

	/**
	 * CacheManager constructor.
	 *
	 * @param {...*} parameters - The injected parameters.
	 * @returns {CacheManager} - The cache manager surrounded by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new CacheManagerProxy());
	}

	/**
	 * @inheritdoc
	 * @private
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
	 * @param {string} [store] - The store name.
	 * @returns {Driver} - The Driver instance.
	 * @throws TypeError - Indicates that the driver could not be resolved.
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
	 * @returns {Driver} - The default driver instance.
	 */
	resolveDefault() {
		return this.resolve(this.config.get('cache.default', 'runtime'));
	}

	/**
	 * Build store by driver name and by configuration.
	 *
	 * @param {string} driver - The driver name.
	 * @param {object<string, *>} [config={}] - The driver configuration.
	 * @returns {Driver} - The driver instance.
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
	 * @inheritdoc
	 */
	getForward() {
		return this.resolveDefault();
	}

}


export default CacheManager;
