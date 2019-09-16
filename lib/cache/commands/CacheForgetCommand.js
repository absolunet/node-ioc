//--------------------------------------------------------
//-- Node IoC - Cache - Command - Flush
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


class CacheForgetCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['cache'];
	}

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['public'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'cache:forget';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Remove an item from the cache';
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [
			['key',   true,  null, 'The name of the cache key you would like to clear'],
			['store', false, null, 'The name of the store for which you would like to clear the key']
		];
	}

	/**
	 * {@inheritdoc}
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
	 * @returns {Driver}
	 */
	getStore() {
		const name = this.parameter('store');
		this.spam(`Getting ${name ? `[${name}]` : 'default'} store instance`);

		return this.cache.resolve(name);
	}

}

module.exports = CacheForgetCommand;
