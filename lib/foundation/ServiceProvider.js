//--------------------------------------------------------
//-- Node IoC - Foundation - Service Provider
//--------------------------------------------------------
'use strict';

class ServiceProvider {

	/**
	 * Load commands into the registrar.
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
