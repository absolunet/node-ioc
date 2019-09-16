//--------------------------------------------------------
//-- Node IoC - Cache - Command - Clear
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


class CacheClearCommand extends Command {

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
		return 'cache:clear';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Flush the application cache';
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [
			['store', null, false, 'The name of the store you would like to clear']
		];
	}

	/**
	 * {@inheritdoc}
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
	 * @returns {Driver}
	 */
	getStore() {
		const name = this.parameter('store');
		this.spam(`Getting ${name ? `[${name}]` : 'default'} store instance`);

		return this.cache.resolve(name);
	}

}

module.exports = CacheClearCommand;
