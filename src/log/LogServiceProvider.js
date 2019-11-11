//--------------------------------------------------------
//-- Node IoC - Log - Log Service Provider
//--------------------------------------------------------

import ServiceProvider from '../foundation/ServiceProvider';
import Level           from './enums/Level';
import Logger          from './services/Logger';
import LogTableCommand from './commands/LogTableCommand';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The log service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="log.services.Logger.html">log</a></li>
 *     <li><a href="log.enums.Level.html">log.level</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="log.commands.LogTableCommand.html">log:table</a></li>
 * </ul>
 * It also uses configuration under "log" namespace.
 *
 * @memberof log
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class LogServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Log';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.bindLogger();
		this.bindLogLevelEnum();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadCommands([
			LogTableCommand
		]);
	}

	/**
	 * Bind logger service.
	 */
	bindLogger() {
		this.app.singleton('log', Logger);
	}

	/**
	 * Bind log level enum.
	 */
	bindLogLevelEnum() {
		this.app.singleton('log.level', Level);
	}

}


export default LogServiceProvider;
