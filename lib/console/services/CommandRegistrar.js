//--------------------------------------------------------
//-- Node IoC - Console - Services - Command Registrar
//--------------------------------------------------------
'use strict';

const __    = require('@absolunet/private-registry');
const glob  = require('glob');


class CommandRegistrar {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'command', 'command.runner', 'file', 'terminal', 'yargs'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('handlers', __(this).get('handlers') || []);
	}

	/**
	 * Add a command in the repository.
	 *
	 * @param {Function<Command>} command
	 */
	add(command) {
		this.commandRepository.add(command);
	}

	/**
	 * Add all commands in the given folder.
	 *
	 * @param {string} folder
	 */
	addFromFolder(folder) {
		this.file.scandir(folder, 'file', { recursive: true, pattern: '*.js', fullPath: true }).forEach((file) => {
			this.add(this.file.load(file));
		});
	}

	/**
	 * Set default command to be executed of nothing is provided.
	 *
	 * @param {Command|Function<Command>} Command
	 */
	setDefault(Command) {
		const command = this.app.make(Command.constructor === Function ? Command : Command.constructor);

		const properties = {
			name: '*',
			description: `Default command [${command.name}]`
		};

		Object.entries(properties).forEach(([key, value]) => {
			Object.defineProperty(command, key, {
				value:        value,
				enumerable:   false,
				writable:     false,
				configurable: false
			});
		});

		this.add(command);
	}

	/**
	 * Retrieve default command from the command repository.
	 *
	 * @returns {Command|null}
	 */
	getDefault() {
		return this.commandRepository.get('*');
	}

	/**
	 * Resolve given console command by getting the related Command
	 * instance and make it handle the request.
	 *
	 * @param {string|Array<string>} command
	 * @param {boolean} [internal]
	 * @returns {Promise<void>}
	 */
	async resolve(command, internal = false) {
		const yargs = this.yargs(command);

		this.bootstrap(yargs, !internal);

		yargs.parse();

		await this.handlers.shift();
	}

	/**
	 * Bootstrap the commands in Yargs.
	 *
	 * @param {yargs} yargs
	 * @param {boolean} [withPolicies]
	 */
	bootstrap(yargs, withPolicies = true) {
		const { app } = this;

		if (app.isBound('version')) {
			yargs.version(app.make('version'));
		}

		yargs
			.option('v', {
				alias: 'verbose',
				describe: 'Adjust the verbosity of the command',
				type: 'boolean'
			})
			.count('v')
			.exitProcess(false)
			.showHelpOnFail(false)
			.locale('en')
			.strict()
			.wrap(Math.min(120, yargs.terminalWidth()));

		this.commandRepository.all(withPolicies).forEach((command) => {
			yargs.command(Object.assign({
				handler: (argv) => {
					const handler = this.commandRunner.run(command, argv, yargs);

					this.handlers.push(handler);

					return handler;
				}
			}, command.yargsModel));
		});
	}

	/**
	 * Currently running command handlers.
	 *
	 * @type {Promise<*>[]}
	 */
	get handlers() {
		return __(this).get('handlers');
	}

	/**
	 * @type {CommandRepository}
	 */
	get commandRepository() {
		return __(this).get('command');
	}

}


module.exports = CommandRegistrar;
