//--------------------------------------------------------
//-- Node IoC - Cache - Command - Cache Flush
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that delete a specific item from the cache.
 *
 * @memberof cache.commands
 * @augments console.Command
 * @hideconstructor
 */
class CacheForgetCommand extends Command {

	/**
	 * Class dependencies: <code>['cache']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['cache']);
	}

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['cache'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'cache:forget';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Remove an item from the cache.';
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [
			['key',   true,  null, 'The name of the cache key you would like to clear.'],
			['store', false, null, 'The name of the store for which you would like to clear the key.']
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const store = this.getStore();
		const key   = this.parameter('key');

		this.info(`Deleting cache item [${key}]`);
		await store.delete(key);
		this.info(`Cache key [${key}] deleted`);
	}

	/**
	 * Get cache store driver instance.
	 *
	 * @returns {cache.services.CacheManager.drivers.Driver} The cache store driver instance.
	 */
	getStore() {
		const name = this.parameter('store');
		this.spam(`Getting ${name ? `[${name}]` : 'default'} store instance`);

		return this.cache.resolve(name);
	}

}

export default CacheForgetCommand;
