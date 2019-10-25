//--------------------------------------------------------
//-- Node IoC - Console - Console Service Provider
//--------------------------------------------------------

import ServiceProvider     from '../foundation/ServiceProvider';
import CommandRepository   from './repositories/CommandRepository';
import CommandRegistrar    from './services/CommandRegistrar';
import CommandRunner       from './services/CommandRunner';
import Terminal            from './services/Terminal';
import Interceptor         from './services/Interceptor';
import YargsEngine         from './services/YargsEngine';
import CaptureInterceptor  from './interceptors/CaptureInterceptor';
import EnvironmentCommand  from './commands/EnvironmentCommand';
import ListCommand         from './commands/ListCommand';
import MakeCommandCommand  from './commands/MakeCommandCommand';
import MakeProviderCommand from './commands/MakeProviderCommand';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
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
 *     <li><a href="console.commands.MakeProviderCommand.html">make:provider</a></li>
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
		this.bindCommandRepository();
		this.bindCommandRegistrar();
		this.bindCommandRunner();
		this.bindTerminal();
		this.bindInterceptorService();
		this.bindCaptureInterceptor();
		this.bindYargsEngine();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.setDefaultCommand();
		this.enableInterceptor();
		this.loadCommands([
			EnvironmentCommand,
			ListCommand,
			MakeCommandCommand,
			MakeProviderCommand
		]);
	}

	/**
	 * Bind command repository.
	 */
	bindCommandRepository() {
		this.app.singleton('command', CommandRepository);

	}

	/**
	 * Bind command registrar.
	 */
	bindCommandRegistrar() {
		this.app.singleton('command.registrar', CommandRegistrar);

	}

	/**
	 * Bind command runner.
	 */
	bindCommandRunner() {
		this.app.singleton('command.runner', CommandRunner);

	}

	/**
	 * Bind terminal service.
	 */
	bindTerminal() {
		this.app.singleton('terminal', Terminal);

	}

	/**
	 * Bind interceptor service.
	 */
	bindInterceptorService() {
		this.app.singleton('terminal.interceptor', Interceptor);

	}

	/**
	 * Bind capture interceptor.
	 */
	bindCaptureInterceptor() {
		this.app.singleton('terminal.interceptor.capture', CaptureInterceptor);

	}

	/**
	 * Bind Yargs service.
	 */
	bindYargsEngine() {
		this.app.singleton('yargs', YargsEngine);
	}


	/**
	 * Set default command into the command registrar.
	 */
	setDefaultCommand() {
		this.app.make('command.registrar').setDefault(ListCommand);
	}

	/**
	 * Enable interceptor service.
	 */
	enableInterceptor() {
		this.app.make('terminal.interceptor').enable();
	}

}


export default ConsoleServiceProvider;
