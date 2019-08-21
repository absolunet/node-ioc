//--------------------------------------------------------
//-- Node IoC - Console - Services - Registrar
//--------------------------------------------------------
'use strict';

const __    = require('@absolunet/private-registry');
const glob  = require('glob');
const yargs = require('yargs');


class CommandRegistrar {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'command', 'file', 'terminal'];
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
	 * @param {Command|Function<Command>} Command
	 */
	add(Command) {
		const { app, terminal, command } = this;
		const commandInstance = app.make(Command, { app, terminal });

		command.add(commandInstance);
	}

	/**
	 * Add all commands in the given folder.
	 *
	 * @param {string} folder
	 */
	addFromFolder(folder) {
		const files = [...new Set([
			...glob.sync(`${folder}/*.js`),
			...glob.sync(`${folder}/**/*.js`)
		])];
		files.forEach((file) => {
			this.add(this.file.load(file));
		});
	}

	/**
	 * Set default command to be executed of nothing is provided.
	 *
	 * @param {Command|Function<Command>} Command
	 */
	setDefault(Command) {
		const command      = this.app.make(Command);
		const originalName = command.name;

		Object.defineProperty(command, 'name', {
			value: '*',
			enumerable: false,
			writable: false,
			configurable: false
		});

		Object.defineProperty(command, 'description', {
			value: `Default command [${originalName}]`,
			enumerable: false,
			writable: false,
			configurable: false
		});

		this.add(command);
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
		const y = yargs(command).count('v');

		this.bootstrap(y, !internal);

		y
			.option('v', {
				alias: 'verbose',
				describe: 'Adjust the verbosity of the command',
				type: 'boolean'
			})
			.count('v')
			.exitProcess(false)
			.showHelpOnFail(false)
			.parse();

		await this.handlers.shift();
	}

	/**
	 * Bootstrap the commands in Yargs.
	 *
	 * @param {yargs} y
	 * @param {boolean} [withPolicies]
	 */
	bootstrap(y, withPolicies = true) {
		const { app } = this;
		if (app.isBound('version')) {
			y.version(app.make('version'));
		}

		this.setYargsWidth(y);

		this.command.all(withPolicies).forEach((command) => {
			y.command(Object.assign({
				handler: (argv) => {
					const handler = this.execute(command, y, argv)
						.catch(async (error) => {
							if (this.app.isBound('exception.handler')) {
								await this.app.make('exception.handler').handle(error);
							}
						});

					this.handlers.push(handler);

					return handler;
				}
			}, command.yargsModel));
		});
	}

	/**
	 * Execute the given command instance in the given Yargs context.
	 *
	 * @param {Command} command
	 * @param {yargs} y
	 * @param {*} argv
	 * @returns {Promise<void>}
	 */
	async execute(command, y, argv) {
		command.setYargs(y);
		const preprocessedArgv = command.preprocess(argv);
		command.setArgv(preprocessedArgv);

		const data = await (command.forward ? command.forwardCall(command.forward) : command.handle());

		return command.postprocess(data);

	}

	/**
	 * Set Yargs print width.
	 *
	 * @param {number} y
	 */
	setYargsWidth(y) {
		y.wrap(Math.min(120, y.terminalWidth()));
	}

	/**
	 * Currently running command handlers.
	 *
	 * @returns {Promise<*>[]}
	 */
	get handlers() {
		return __(this).get('handlers');
	}

}


module.exports = CommandRegistrar;
