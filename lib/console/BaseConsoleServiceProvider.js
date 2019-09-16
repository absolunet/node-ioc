//--------------------------------------------------------
//-- Node IoC - Console - Base console service provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');


class BaseConsoleServiceProvider extends ServiceProvider {

	/**
	 * Service provider directory accessor.
	 *
	 * @returns {string}
	 */
	get directory() {
		return this.app.providerPath();
	}

	/**
	 * Commands path accessor.
	 *
	 * @returns {string}
	 */
	get commandsPath() {
		return this.app.formatPath(this.directory, '..', 'commands');
	}

	/**
	 * Boot service provider.
	 */
	boot() {
		if (this.app.isBound('command.registrar')) {
			this.app.make('command.registrar').addFromFolder(this.commandsPath);
		}
	}

}


module.exports = BaseConsoleServiceProvider;
