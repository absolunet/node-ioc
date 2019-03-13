//--------------------------------------------------------
//-- Node IoC - Console - Command - Registrar
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const glob = require('glob');
const yargs = require('yargs');


class CommandRegistrar {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app', 'terminal', 'command'];
	}

	/**
	 * CommandRegistrar constructor.
	 *
	 * @param {Application} app
	 * @param {Terminal} terminal
	 * @param {CommandRepository} commandRepository
	 */
	constructor(app, terminal, commandRepository) {
		__(this).set('app', app);
		__(this).set('terminal', terminal);
		__(this).set('command', commandRepository);
	}

	/**
	 * Add a command in the repository.
	 *
	 * @param {Command|NewableFunction<Command>} Command
	 */
	add(Command) {
		const app = __(this).get('app');
		const terminal = __(this).get('terminal');

		const command = app.make(Command);
		command.app = app;
		command.terminal = terminal;

		this.commands.add(command);
	}

	/**
	 * Add all commands in the given folder.
	 *
	 * @param {string} folder
	 */
	addFromFolder(folder) {
		const files = glob.sync(`${folder}/*.js`);
		files.forEach((file) => {
			this.add(require(file)); // eslint-disable-line global-require
		});
	}

	/**
	 * Set default command to be executed of nothing is provided.
	 *
	 * @param {Command|NewableFunction<Command>} Command
	 */
	setDefault(Command) {
		const command = __(this).get('app').make(Command);

		Object.defineProperty(command, 'name', {
			value: '*',
			enumerable: true,
			writable: true,
			configurable: true
		});

		this.add(command);
	}

	/**
	 * Resolve given console command by getting the related Command
	 * instance and make it handle the request.
	 *
	 * @param {string} command
	 * @returns {Promise<void>}
	 */
	resolve(command) {
		return new Promise((resolve, reject) => {
			const y = yargs(command.split(' ')).count('v');
			this.bootstrap(y);
			y
				.option('v', {
					alias: 'verbose',
					describe: 'Adjust the verbosity of the command',
					type: 'boolean'
				})
				.count('v')
				.exitProcess(false)
				.parse();
			if (this.handler) {
				this.handler.then(resolve, reject);
			} else {
				resolve();
			}
		});
	}

	/**
	 * Bootstrap the commands in Yargs.
	 *
	 * @param {yargs} y
	 */
	bootstrap(y) {
		const app = __(this).get('app');
		if (app.isBound('version')) {
			y.version(app.make('version'));
		}
		this.commands.all().forEach((command) => {
			y.command(Object.assign({
				handler: (argv) => {
					return this.execute(command, y, argv);
				}
			}, command.yargsModel));
		});
	}

	/**
	 * Execute the given command instancein the given Yargs context.
	 *
	 * @param {Command} command
	 * @param {yargs} y
	 * @param {*} argv
	 * @returns {Promise<void>}
	 */
	execute(command, y, argv) {
		this.handler = new Promise((resolve, reject) => {
			try {
				command.setYargs(y);
				command.setArgv(argv);

				const handler = command.handle();
				if (handler instanceof Promise) {
					handler.then(resolve, reject);
				} else {
					resolve();
				}
			} catch (error) {
				reject(error);
			}
		});

		return this.handler;
	}

	/**
	 * CommandRepository accessor.
	 *
	 * @returns {CommandRepository}
	 */
	get commands() {
		return __(this).get('command');
	}

}

module.exports = CommandRegistrar;
