//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Service Provider
//--------------------------------------------------------

import ServiceProvider       from '../foundation/ServiceProvider';
import HttpClient            from './services/Client';
import HttpServer            from './services/Server';
import Handler               from './services/Handler';
import Router                from './services/Router';
import HttpErrorMapper       from './services/HttpErrorMapper';
import RouteRepository       from './repositories/RouteRepository';
import ControllerRepository  from './repositories/ControllerRepository';
import RedirectController    from './controllers/RedirectController';
import StaticController      from './controllers/StaticController';
import MakeControllerCommand from './commands/MakeControllerCommand';
import ServeCommand          from './commands/ServeCommand';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The HTTP service provider.
 * It bind these following services:
 * <ul>
 *     <li><a href="http.services.Client.html">http</a></li>
 *     <li><a href="http.services.Server.html">server</a></li>
 *     <li><a href="http.services.Router.html">router</a></li>
 *     <li><a href="http.services.Handler.html">router.handler</a></li>
 *     <li><a href="http.services.HttpErrorMapper.html">http.error.mapper</a></li>
 *     <li><a href="http.repositories.RouteRepository.html">router.route</a></li>
 *     <li><a href="http.repositories.ControllerRepository.html">route.controller</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="http.commands.MakeControllerCommand.html">make:controller</a></li>
 *     <li><a href="http.commands.ServeCommand.html">serve</a></li>
 * </ul>
 * It also uses configuration under "http" namespace.
 *
 * @memberof http
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class HttpServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.registerServices();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadConfig();
		this.createPolicies();
		this.bootDefaultControllers();
		this.loadCommands([
			MakeControllerCommand,
			ServeCommand
		]);
	}

	/**
	 * Register HTTP services.
	 */
	registerServices() {
		this.app.singleton('http',              HttpClient);
		this.app.singleton('server',            HttpServer);
		this.app.singleton('router',            Router);
		this.app.singleton('router.handler',    Handler);
		this.app.singleton('http.error.mapper', HttpErrorMapper);
		this.app.singleton('router.route',      RouteRepository);
		this.app.singleton('router.controller', ControllerRepository);
	}

	/**
	 * Load configuration file.
	 */
	loadConfig() {
		if (this.app.isBound('config')) {
			this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
		}
	}

	/**
	 * Create database related policies.
	 */
	createPolicies() {
		if (this.app.isBound('gate')) {
			this.app.make('gate')
				.policy('http', () => {
					return this.app.make('config').get('http.enabled', false);
				});
		}
	}

	/**
	 * Boot the default controllers.
	 */
	bootDefaultControllers() {
		const controllerRepository = this.app.make('router.controller');
		controllerRepository.group(controllerRepository.coreNamespace, () => {
			controllerRepository.add('StaticController', StaticController);
			controllerRepository.add('RedirectController', RedirectController);
		});
	}

}


export default HttpServiceProvider;
