//--------------------------------------------------------
//-- Node IoC - Foundation - Service Provider
//--------------------------------------------------------
'use strict';

/**
 * Base service provider class.
 *
 * @memberof foundation
 * @abstract
 * @hideconstructor
 */
class ServiceProvider {

	/**
	 * Load commands into the registrar.
	 *
	 * @param {Array<Function>} commands - List of all commands that must be registered.
	 */
	loadCommands(commands) {
		if (this.app.isBound('command')) {
			const commandRepository = this.app.make('command');

			commands.forEach((command) => {
				commandRepository.add(command);
			});
		}
	}

}


module.exports = ServiceProvider;
