//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const YargsEngine = require('./services/YargsEngine');

const CommandRepository  = require('./repositories/CommandRepository');
const CommandRegistrar   = require('./services/CommandRegistrar');
const CommandRunner      = require('./services/CommandRunner');
const Terminal           = require('./services/Terminal');
const Interceptor        = require('./services/Interceptor');

const CaptureInterceptor = require('./interceptors/CaptureInterceptor');

const EnvironmentCommand = require('./commands/EnvironmentCommand');
const ListCommand        = require('./commands/ListCommand');
const MakeCommandCommand = require('./commands/MakeCommandCommand');



class ConsoleServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('yargs',                        YargsEngine);
		this.app.singleton('command',                      CommandRepository);
		this.app.singleton('command.registrar',            CommandRegistrar);
		this.app.singleton('command.runner',               CommandRunner);
		this.app.singleton('terminal',                     Terminal);
		this.app.singleton('terminal.interceptor',         Interceptor);
		this.app.singleton('terminal.interceptor.capture', CaptureInterceptor);
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.setDefaultCommand();
		this.app.make('terminal.interceptor').enable();
		this.loadCommands([
			EnvironmentCommand,
			ListCommand,
			MakeCommandCommand
		]);
	}

	setDefaultCommand() {
		this.app.make('command.registrar').setDefault(ListCommand);
	}

}


module.exports = ConsoleServiceProvider;
