//--------------------------------------------------------
//-- Node IoC - Console - Command - Registrar
//--------------------------------------------------------
'use strict';

const glob  = require('glob');
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
	 * Add a command in the repository.
	 *
	 * @param {Command|Function<Command>} Command
	 */
	add(Command) {
		const { app, terminal, command } = this;
		const commandInstance = app.make(Command);
		commandInstance.app = app;
		commandInstance.terminal = terminal;

		command.add(commandInstance);
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
	 * @param {Command|Function<Command>} Command
	 */
	setDefault(Command) {
		const command = this.app.make(Command);
		const originalName = command.name;

		Object.defineProperty(command, 'name', {
			value: '*',
			enumerable: true,
			writable: false,
			configurable: false
		});

		Object.defineProperty(command, 'description', {
			value: `Default command [${originalName}]`,
			enumerable: true,
			writable: false,
			configurable: false
		});

		this.add(command);
	}

	/**
	 * Resolve given console command by getting the related Command
	 * instance and make it handle the request.
	 *
	 * @param {string} command
	 * @param {boolean} [internal]
	 * @returns {Promise<void>}
	 */
	resolve(command, internal = false) {
		return new Promise((resolve, reject) => {
			const y = yargs(command.split(' ')).count('v');
			this.bootstrap(y, !internal);
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
	 * @param {boolean} [withPolicies]
	 */
	bootstrap(y, withPolicies = true) {
		const app = this.app;  // eslint-disable-line prefer-destructuring
		if (app.isBound('version')) {
			y.version(app.make('version'));
		}
		this.command.all(withPolicies).forEach((command) => {
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
				const preprocessedArgv = command.preprocess(argv);
				command.setArgv(preprocessedArgv);

				let handler;

				if (command.forward) {
					handler = command.forwardCall(command.forward);
				} else {
					handler = command.handle();
				}

				if (handler instanceof Promise) {
					handler.then((data) => {
						resolve(command.postprocess(data));

						return data;
					}).catch(reject);
				} else {
					resolve();
				}
			} catch (error) {
				reject(error);
			}
		});

		return this.handler;
	}

}


module.exports = CommandRegistrar;
