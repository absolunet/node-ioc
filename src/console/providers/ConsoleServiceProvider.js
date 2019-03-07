//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------
'use strict';


const CommandRegistrar = require('./../services/CommandRegistrar');
const CommandRepository = require('./../repository/CommandRepository');
const ListCommand = require('./../commands/ListCommand');
const ServiceProvider = require('./../../foundation/ServiceProvider');
const Terminal = require('./../services/Terminal');


class ConsoleServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('command', CommandRepository);
		this.app.singleton('command.registrar', CommandRegistrar);
		this.app.singleton('terminal', Terminal);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		const registrar = this.app.make('command.registrar');
		registrar.add(ListCommand);
		registrar.setDefault(ListCommand);
	}

}

module.exports = ConsoleServiceProvider;
