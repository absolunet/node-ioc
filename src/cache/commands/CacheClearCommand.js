//--------------------------------------------------------
//-- Node IoC - Cache - Command - Cache Clear
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


/**
 * Command that flushes the whole cache.
 *
 * @memberof cache.commands
 * @augments console.Command
 * @hideconstructor
 */
class CacheClearCommand extends Command {

	/**
	 * Class dependencies.
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
		return ['public'];
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
			['store', null, false, 'The name of the store you would like to clear.']
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
	 * @returns {Driver} - The cache store driver instance.
	 */
	getStore() {
		const name = this.parameter('store');
		this.spam(`Getting ${name ? `[${name}]` : 'default'} store instance`);

		return this.cache.resolve(name);
	}

}

module.exports = CacheClearCommand;
