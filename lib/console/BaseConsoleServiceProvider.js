//--------------------------------------------------------
//-- Node IoC - Console - Base console service provider
//--------------------------------------------------------
'use strict';

const path = require('path');

const ServiceProvider = require('./../foundation/ServiceProvider');


class BaseConsoleServiceProvider extends ServiceProvider {

	/**
	 * Service provider directory accessor.
	 *
	 * @returns {string}
	 */
	get directory() {
		return path.join(process.cwd(), 'lib', 'providers');
	}

	/**
	 * Commands path accessor.
	 *
	 * @returns {string}
	 */
	get commandsPath() {
		return path.resolve(this.directory, '..', 'commands');
	}

	/**
	 * Boot service provider.
	 */
	boot() {
		this.app.make('command.registrar')
			.addFromFolder(this.commandsPath)
		;
	}

}


module.exports = BaseConsoleServiceProvider;
