//--------------------------------------------------------
//-- Node IoC - Foundation - Console Kernel
//--------------------------------------------------------

import __                     from '@absolunet/private-registry';
import ConsoleServiceProvider from '../../console/ConsoleServiceProvider';
import BaseKernel             from '../Kernel';


/**
 * The console kernel that implements the needed flow for a proper CLI request handling.
 *
 * @memberof foundation.console
 * @augments foundation.Kernel
 * @hideconstructor
 */
class Kernel extends BaseKernel {

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
		await this.beforeHandling();
		await this.call(this.terminal.argv);
		await this.afterHandling();
	}

	/**
	 * Called just before handling incoming request.
	 *
	 * @abstract
	 */
	beforeHandling() {
		//
	}

	/**
	 * Called just after handling incoming request, if no error was thrown.
	 *
	 * @abstract
	 */
	afterHandling() {
		//
	}

	/**
	 * Call the given command and process it through the command registrar.
	 *
	 * @param {string} command - The current command.
	 * @returns {Promise} The async process promise.
	 */
	async call(command) {
		await this.commandRegistrar.resolve(command);
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
		this.terminating();

		if (__(this).get('shouldExit')) {
			process.exit(this.app.make('exception.handler').hadException ? 1 : 0); // eslint-disable-line unicorn/no-process-exit, no-process-exit
		}
	}

	/**
	 * Called when the application is terminating.
	 *
	 * @abstract
	 */
	terminating() {
		//
	}

	/**
	 * CommandRegistrar accessor.
	 *
	 * @type {console.services.CommandRegistrar}
	 */
	get commandRegistrar() {
		return this.app.make('command.registrar');
	}

	/**
	 * Terminal accessor.
	 *
	 * @type {console.services.Terminal}
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


export default Kernel;
