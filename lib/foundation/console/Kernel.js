//--------------------------------------------------------
//-- Node IoC - Foundation - Console Kernel
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const ConsoleServiceProvider = require('../../console/ConsoleServiceProvider');
const Kernel                 = require('../Kernel');


class ConsoleKernel extends Kernel {

	/**
	 * Console kernel constructor.
	 */
	constructor(...parameters) {
		super(...parameters);
		this.shouldExit();
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		this.registerCommands();

		return this.call(this.terminal.argv);
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
		this.commandRegistrar.addFromFolder(this.app.commandPath());
	}

	/**
	 * Specify if the kernel should exit the current process when terminating.
	 *
	 * @param {boolean} [shouldExit]
	 */
	shouldExit(shouldExit = true) {
		__(this).set('shouldExit', shouldExit);
	}

	/**
	 * {@inheritdoc}
	 */
	terminate() {
		const code = this.app.make('exception.handler').hadException ? 1 : 0;

		return __(this).get('shouldExit') ? process.exit(code) : true; // eslint-disable-line unicorn/no-process-exit, no-process-exit
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
