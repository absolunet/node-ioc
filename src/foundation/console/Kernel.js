//--------------------------------------------------------
//-- Node IoC - Foundation - Console Kernel
//--------------------------------------------------------
'use strict';


const ConsoleServiceProvider = require('./../../console/providers/ConsoleServiceProvider');
const Kernel = require('./../Kernel');


class ConsoleKernel extends Kernel {

	/**
	 * {@inheritdoc}
	 */
	handle() {
		this.registerCommands();

		return this.call(this.terminal.command);
	}

	/**
	 * Call the given command and process it through the command registrar.
	 *
	 * @param command
	 * @returns {Promise<void>}
	 */
	call(command) {
		return this.commandRegistrar.resolve(command);
	}

	/**
	 * Register commands in the command registrar based on application command path.
	 */
	registerCommands() {
		if (this.app.isBound('path.command')) {
			const commandPath = this.app.make('path.command');
			this.commandRegistrar.addFromFolder(commandPath);
		}
	}

	/**
	 * {@inheritdoc}
	 */
	terminate() {
		const code = this.app.make('exception.handler').hadException ? 1 : 0;

		return process.exit(code); // eslint-disable-line unicorn/no-process-exit, no-process-exit
	}

	/**
	 * CommandRegistrar accessor.
	 *
	 * @returns {CommandRegistrar}
	 */
	get commandRegistrar() {
		return this.app.make('command.registrar');
	}

	/**
	 * Terminal accessor.
	 *
	 * @returns {Terminal}
	 */
	get terminal() {
		return this.app.make('terminal');
	}


	/**
	 * {@inheritdoc}
	 */
	get bootstrappers() {
		return [
			ConsoleServiceProvider
		];
	}

}

module.exports = ConsoleKernel;
