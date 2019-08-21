//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider    = require('../BaseConsoleServiceProvider');
const ListCommand        = require('../commands/ListCommand');
const CommandRepository  = require('../repository/CommandRepository');
const CommandRegistrar   = require('../services/CommandRegistrar');
const Terminal           = require('../services/Terminal');
const Interceptor        = require('../services/Interceptor');
const CaptureInterceptor = require('../services/CaptureInterceptor');


class ConsoleServiceProvider extends ServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	get directory() {
		return __dirname;
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('command',                      CommandRepository);
		this.app.singleton('command.registrar',            CommandRegistrar);
		this.app.singleton('terminal',                     Terminal);
		this.app.singleton('terminal.interceptor',         Interceptor);
		this.app.singleton('terminal.interceptor.capture', CaptureInterceptor);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		super.boot();
		this.setDefaultCommand();
		this.app.make('terminal.interceptor').enable();
	}

	setDefaultCommand() {
		this.app.make('command.registrar').setDefault(ListCommand);
	}

}


module.exports = ConsoleServiceProvider;
