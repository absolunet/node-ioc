//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const CommandRepository = require('./repositories/CommandRepository');

const CommandRegistrar = require('./services/CommandRegistrar');

const CommandRunner = require('./services/CommandRunner');

const Terminal = require('./services/Terminal');

const Interceptor = require('./services/Interceptor');

const YargsEngine = require('./services/YargsEngine');

const CaptureInterceptor = require('./interceptors/CaptureInterceptor');

const EnvironmentCommand = require('./commands/EnvironmentCommand');

const ListCommand = require('./commands/ListCommand');

const MakeCommandCommand = require('./commands/MakeCommandCommand'); // eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The console service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="console.repositories.CommandRepository.html">command</a></li>
 *     <li><a href="console.services.CommandRegistrar.html">command.registrar</a></li>
 *     <li><a href="console.services.CommandRunner.html">command.runner</a></li>
 *     <li><a href="console.services.Terminal.html">terminal</a></li>
 *     <li><a href="console.services.Interceptor.html">terminal.interceptor</a></li>
 *     <li><a href="console.interceptors.CaptureInterceptor.html">terminal.interceptor.capture</a></li>
 *     <li><a href="console.services.YargsEngine.html">yargs</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="console.commands.EnvironmentCommand.html">env</a></li>
 *     <li><a href="console.commands.ListCommand.html">list</a></li>
 *     <li><a href="console.commands.MakeCommandCommand.html">make:command</a></li>
 * </ul>
 *
 * @memberof console
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */


class ConsoleServiceProvider extends ServiceProvider {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('command', CommandRepository);
    this.app.singleton('command.registrar', CommandRegistrar);
    this.app.singleton('command.runner', CommandRunner);
    this.app.singleton('terminal', Terminal);
    this.app.singleton('terminal.interceptor', Interceptor);
    this.app.singleton('terminal.interceptor.capture', CaptureInterceptor);
    this.app.singleton('yargs', YargsEngine);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.setDefaultCommand();
    this.app.make('terminal.interceptor').enable();
    this.loadCommands([EnvironmentCommand, ListCommand, MakeCommandCommand]);
  }
  /**
   * Set default command into the command registrar.
   */


  setDefaultCommand() {
    this.app.make('command.registrar').setDefault(ListCommand);
  }

}

module.exports = ConsoleServiceProvider;