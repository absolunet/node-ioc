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
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - HTTP';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.bindHttpClient();
		this.bindHttpServer();
		this.bindRouter();
		this.bindRouteHandler();
		this.bindHttpErrorMapper();
		this.bindRouteRepository();
		this.bindControllerRepository();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.createPolicies();
		this.bootDefaultControllers();
		this.loadCommands([
			MakeControllerCommand,
			ServeCommand
		]);
	}

	/**
	 * Bind HTTP client service.
	 */
	bindHttpClient() {
		this.app.singleton('http', HttpClient);
	}

	/**
	 * Bind HTTP server service.
	 */
	bindHttpServer() {
		this.app.singleton('server', HttpServer);
	}

	/**
	 * Bind HTTP router.
	 */
	bindRouter() {
		this.app.singleton('router', Router);
	}

	/**
	 * Bind router handler service.
	 */
	bindRouteHandler() {
		this.app.singleton('router.handler', Handler);
	}

	/**
	 * Bind HTTP error mapper.
	 */
	bindHttpErrorMapper() {
		this.app.singleton('http.error.mapper', HttpErrorMapper);
	}

	/**
	 * Bind route repository.
	 */
	bindRouteRepository() {
		this.app.singleton('router.route', RouteRepository);
	}

	/**
	 * Bind controller repository.
	 */
	bindControllerRepository() {
		this.app.singleton('router.controller', ControllerRepository);
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
