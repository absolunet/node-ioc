//--------------------------------------------------------
//-- Node IoC - Console - Services - Command Registrar
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Class that registers the command and bootstraps all the needed instances in order to make the CLI engine works.
 *
 * @memberof console.services
 * @hideconstructor
 */
class CommandRegistrar {

	/**
	 * Class dependencies: <code>['app', 'command', 'command.runner', 'file', 'terminal', 'yargs']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'command', 'command.runner', 'file', 'terminal', 'yargs'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('handlers', __(this).get('handlers') || []);
	}

	/**
	 * Add a command in the repository.
	 *
	 * @param {Function} command - A command to add.
	 */
	add(command) {
		this.commandRepository.add(command);
	}

	/**
	 * Add all commands in the given folder.
	 *
	 * @param {string} folder - A folder from which load commands.
	 */
	addFromFolder(folder) {
		this.file.scandir(folder, 'file', { recursive: true, pattern: '*.js', fullPath: true }).forEach((file) => {
			this.add(this.file.load(file));
		});
	}

	/**
	 * Set default command to be executed of nothing is provided.
	 *
	 * @param {console.Command|Function} Command - The default command.
	 */
	setDefault(Command) {
		const command = this.app.make(Command.constructor === Function ? Command : Command.constructor);

		const properties = {
			name: '*',
			description: `Default command [${command.name}]`
		};

		Object.entries(properties).forEach(([key, value]) => {
			Object.defineProperty(command, key, {
				value,
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
	 * @returns {console.Command|null} The default command instance.
	 */
	getDefault() {
		return this.commandRepository.get('*');
	}

	/**
	 * Resolve given console command by getting the related Command
	 * instance and make it handle the request.
	 *
	 * @param {string|Array<string>} command - The command to resolve.
	 * @param {boolean} [internal] - Specify if the command should be processed as an internal process. If if should check the policies restrictions, set to false.
	 * @returns {Promise} The async process promise.
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
	 * @param {yargs} yargs - The Yargs instance.
	 * @param {boolean} [withPolicies] - Indicates that the policies should be checked before bootstrapping them.
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
	 * @type {Array<Promise<*>>}
	 */
	get handlers() {
		return __(this).get('handlers');
	}

	/**
	 * The command repository.
	 *
	 * @type {console.repositories.CommandRepository}
	 */
	get commandRepository() {
		return __(this).get('command');
	}

}


export default CommandRegistrar;
