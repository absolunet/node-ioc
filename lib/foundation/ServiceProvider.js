//--------------------------------------------------------
//-- Node IoC - Foundation - Service Provider
//--------------------------------------------------------
'use strict';

class ServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return [];
	}

	/**
	 * Load commands into the registrar.
	 */
	loadCommands(commands) {
		if (this.app.isBound('command.registrar')) {
			const registrar = this.app.make('command.registrar');

			commands.forEach((command) => {
				registrar.add(command);
			});
		}
	}

}


module.exports = ServiceProvider;
