//--------------------------------------------------------
//-- Node IoC - Database - Command - Seed
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


/**
 * Class that seeds the database with records.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class SeedCommand extends Command {

	/**
	 * Class dependencies.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config', 'db', 'terminal.interceptor']);
	}

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['db'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return `${this.prefix}:seed`;
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Seed the database with records.';
	}

	/**
	 * Command prefix.
	 *
	 * @type {string}
	 */
	get prefix() {
		return this.config.get('database.command_namespace');
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const connection = await this.db.getConnection();

		this.info('Seeding database');

		const { seeds, output } = await this.seed(connection);

		output.forEach((string) => {
			this.warning(string);
		});

		this.info('Seed successful!');
		seeds.forEach((seed) => {
			this.success(`Seeded: ${seed.replace('\\', '/').split('/').pop()}`);
		});
	}

	/**
	 * Seed the database.
	 *
	 * @param {Connector} connection - The database connection to use.
	 * @returns {Promise<{output: *, seeds: *}>} - The seeders that ran and the output made by Knex.
	 */
	async seed(connection) {
		this.terminalInterceptor.startCapture();

		const [seeds] = await connection.seed.run();

		const output  = this.terminalInterceptor.stopCapture();

		return { seeds, output };
	}

}


module.exports = SeedCommand;
