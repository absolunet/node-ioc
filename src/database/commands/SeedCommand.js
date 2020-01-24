//--------------------------------------------------------
//-- Node IoC - Database - Command - Seed
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Class that seeds the database with records.
 *
 * @memberof database.commands
 * @augments console.Command
 * @hideconstructor
 */
class SeedCommand extends Command {

	/**
	 * Class dependencies: <code>['config', 'db', 'terminal.interceptor']</code>.
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
		return this.t('commands.db-seed.description');
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [
			['file', 'DatabaseSeeder', this.t('commands.db-seed.options.file')]
		];
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

		this.info(this.t('commands.db-seed.messages.seeding'));

		const { seeds, output } = await this.seed(connection);

		output.forEach((string) => {
			this.warning(string);
		});

		this.info(this.t('commands.db-seed.messages.success'));
		seeds.forEach((seed) => {
			this.success(this.t('commands.db-seed.messages.seeded', {
				seeder: seed.replace('\\', '/').split('/').pop()
			}));
		});
	}

	/**
	 * Seed the database.
	 *
	 * @param {database.services.Connector} connection - The database connection to use.
	 * @returns {Promise<{output: *, seeds: *}>} The seeders that ran and the output made by Knex.
	 */
	async seed(connection) {
		this.terminalInterceptor.startCapture();

		const specific = `${this.option('file').replace(/\.js$/u, '')}.js`;
		const [seeds] = await connection.seed.run({ specific });

		const output  = this.terminalInterceptor.stopCapture();

		return { seeds, output };
	}

}


export default SeedCommand;
