//--------------------------------------------------------
//-- Node IoC - Cache - Cache Service Provider
//--------------------------------------------------------

import ServiceProvider    from '../foundation/ServiceProvider';
import CacheManager       from './services/CacheManager';
import CacheClearCommand  from './commands/CacheClearCommand';
import CacheForgetCommand from './commands/CacheForgetCommand';
import CacheTableCommand  from './commands/CacheTableCommand';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The cache service provider.
 * It offers these commands:
 * <ul>
 *     <li><a href="cache.commands.CacheClearCommand.html">cache:clear</a></li>
 *     <li><a href="cache.commands.CacheForgetCommand.html">cache:forget</a></li>
 *     <li><a href="cache.commands.CacheTableCommand.html">cache:table</a></li>
 * </ul>
 * It also uses configuration under "cache" namespace.
 *
 * @memberof cache
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class CacheServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Cache';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.bindCacheManager();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadCommands([
			CacheClearCommand,
			CacheForgetCommand,
			CacheTableCommand
		]);
	}

	/**
	 * Bind cache manager service.
	 */
	bindCacheManager() {
		this.app.singleton('cache', CacheManager);
	}

}


export default CacheServiceProvider;
