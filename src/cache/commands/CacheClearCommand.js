//--------------------------------------------------------
//-- Node IoC - Cache - Command - Cache Clear
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that flushes the whole cache.
 *
 * @memberof cache.commands
 * @augments console.Command
 * @hideconstructor
 */
class CacheClearCommand extends Command {

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
	get name() {
		return 'cache:clear';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Flush the application cache.';
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [
			['store', false, null, 'The name of the store you would like to clear.']
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const store = this.getStore();

		this.info('Flushing cache');
		await store.flush();
		this.info('Cache flushed');
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

export default CacheClearCommand;
