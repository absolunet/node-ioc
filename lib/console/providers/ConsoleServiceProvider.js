//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider   = require('./../BaseConsoleServiceProvider');
const ListCommand       = require('./../commands/ListCommand');
const CommandRepository = require('./../repository/CommandRepository');
const CommandRegistrar  = require('./../services/CommandRegistrar');
const Terminal          = require('./../services/Terminal');


class ConsoleServiceProvider extends ServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	// eslint-disable-next-line unicorn/prevent-abbreviations
	get dir() {
		return __dirname;
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('command',           CommandRepository);
		this.app.singleton('command.registrar', CommandRegistrar);
		this.app.singleton('terminal',          Terminal);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		super.boot();
		const registrar = this.app.make('command.registrar');
		registrar.setDefault(ListCommand);
	}

}


module.exports = ConsoleServiceProvider;
