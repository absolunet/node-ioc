//--------------------------------------------------------
//-- Node IoC - Foundation - Console Kernel
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const ConsoleServiceProvider = require('../../console/ConsoleServiceProvider');
const Kernel                 = require('../Kernel');


/**
 * The console kernel that implements the needed flow for a proper CLI request handling.
 *
 * @memberof foundation.console
 * @augments foundation.Kernel
 * @hideconstructor
 */
class ConsoleKernel extends Kernel {

	/**
	 * ConsoleKernel constructor.
	 *
	 * @param {...*} parameters - Injected parameters.
	 */
	constructor(...parameters) {
		super(...parameters);
		this.shouldExit();
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.registerCommands();

		await this.call(this.terminal.argv);
	}

	/**
	 * Call the given command and process it through the command registrar.
	 *
	 * @param {string} command - The current command.
	 * @returns {Promise<void>} - The async process promise.
	 */
	async call(command) {
		await this.commandRegistrar.resolve(command);
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
	 * @param {boolean} [shouldExit] - Indicates if the process should exit at the end.
	 */
	shouldExit(shouldExit = true) {
		__(this).set('shouldExit', shouldExit);
	}

	/**
	 * @inheritdoc
	 */
	terminate() {
		if (__(this).get('shouldExit')) {
			process.exit(this.app.make('exception.handler').hadException ? 1 : 0); // eslint-disable-line unicorn/no-process-exit, no-process-exit
		}
	}

	/**
	 * CommandRegistrar accessor.
	 *
	 * @type {CommandRegistrar}
	 */
	get commandRegistrar() {
		return this.app.make('command.registrar');
	}

	/**
	 * Terminal accessor.
	 *
	 * @type {Terminal}
	 */
	get terminal() {
		return this.app.make('terminal');
	}


	/**
	 * @inheritdoc
	 */
	get bootstrappers() {
		return [
			ConsoleServiceProvider
		];
	}

}


module.exports = ConsoleKernel;
