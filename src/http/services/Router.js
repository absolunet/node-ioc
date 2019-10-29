//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Router
//--------------------------------------------------------

import __                from '@absolunet/private-registry';
import Route             from '../Route';


/**
 * @private
 * @typedef {object} GroupOptions
 * @property {string} [as] - Route name.
 * @property {string} [prefix] - Route path prefix.
 * @property {string} [namespace] - Controller namespace to use.
 * @memberof http
 */

/**
 * @private
 * @typedef {object} RouteAttributes
 * @property {string} [asPrefix] - The route name prefix.
 * @property {string} [method] - The route HTTP method.
 * @property {string} [path] - The route path.
 * @property {string|Function} [action] - The route action, either a closure or a controller action.
 * @memberof http
 */

/**
 * @private
 * @typedef {object} BaseResourceData
 * @property {string} name - The resource name.
 * @property {string} method - The resource HTTP method.
 * @memberof http
 */

/**
 * @private
 * @typedef {ResourceData} ResourceAction
 * @property {boolean} single - Indicates that the resource handle a single instance and not a collection.
 * @memberof http
 */

/**
 * @private
 * @typedef {object} ResourceData
 * @property {string} action - The resource action name.
 * @property {string} url - The resource URL.
 * @memberof http
 */

/**
 * The HTTP router.
 * It wraps Express route bootstrapping into a convenient system that handles injection and names controller actions.
 *
 * @memberof http.services
 * @hideconstructor
 */
class Router {

	/**
	 * Class dependencies: <code>['app', 'server', 'router.handler', 'router.route', 'router.controller']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'server', 'router.handler', 'router.route', 'router.controller'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('groups', []);
		__(this).set('expressRouter', null);
	}

	/**
	 * Register a new GET route with the router.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	get(path, action) {
		return this.addRoute('get', path, action);
	}

	/**
	 * Register a new POST route with the router.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	post(path, action) {
		return this.addRoute('post', path, action);
	}

	/**
	 * Register a new PUT route with the router.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	put(path, action) {
		return this.addRoute('put', path, action);
	}

	/**
	 * Register a new PATCH route with the router.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	patch(path, action) {
		return this.addRoute('patch', path, action);
	}

	/**
	 * Register a new DELETE route with the router.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	delete(path, action) {
		return this.addRoute('delete', path, action);
	}

	/**
	 * Register a new route responding to all verbs.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	any(path, action) {
		return this.addRoute('all', path, action);
	}

	/**
	 * Register a new route responding to all verbs.
	 *
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	all(path, action) {
		return this.any(path, action);
	}

	/**
	 * Register a fallback route that matches anything in the current scope.
	 *
	 * @param {string|Function} action - The route action.
	 * @returns {http.Route} The newly created route instance.
	 */
	fallback(action) {
		return this.any('*', action);
	}

	/**
	 * Create a redirection route.
	 * The redirection can either be permanent or temporary.
	 *
	 * @param {string} from - The path to redirect from.
	 * @param {string} to - The destination path to redirect on.
	 * @param {boolean} [permanent] - Indicates that the redirection is permanent.
	 * @returns {http.Route} The newly created route instance.
	 */
	redirect(from, to, permanent = false) {
		return this.any(from, this.withCorePrefix('RedirectController@handle'))
			.with('to', to)
			.with('permanent', permanent);
	}

	/**
	 * Create a permanent redirection route.
	 *
	 * @param {string} from - The path to redirect from.
	 * @param {string} to - The destination path to redirect on.
	 * @returns {http.Route} The newly created route instance.
	 */
	permanentRedirect(from, to) {
		return this.redirect(from, to, true);
	}

	/**
	 * Register a static path for files.
	 *
	 * @param {string} path - The path for static route serving.
	 * @param {string} folder - The folder where the static content is hosted.
	 * @returns {http.Route} The newly created route instance.
	 */
	static(path, folder) {
		return this.get(`${path}/:file`, this.withCorePrefix('StaticController@handle'))
			.where('file', '[^\\s]+')
			.with({ path, folder });
	}

	/**
	 * Get controller name with core prefix.
	 *
	 * @param {string} name - The controller name.
	 * @returns {string} The fully qualified controller name.
	 */
	withCorePrefix(name) {
		const { coreNamespace, namespaceSeparator } = this.controllers;

		return `${coreNamespace}${namespaceSeparator}${name}`;
	}

	/**
	 * Add a controller binding.
	 *
	 * @param {string} name - The controller name.
	 * @param {http.controllers.Controller} controller - The controller class.
	 * @returns {http.repositories.ControllerRepository} The controller repository instance.
	 */
	controller(name, controller) {
		return this.controllers.add(name, controller);
	}

	/**
	 * Create a controller group.
	 *
	 * @param {string} namespace - The controller namespace.
	 * @param {Function} group - The controller group closure.
	 * @returns {http.repositories.ControllerRepository} The controller repository instance.
	 */
	controllerGroup(namespace, group) {
		return this.controllers.group(namespace, group);
	}

	/**
	 * Create resource routes.
	 * Uses the same controller for each resource route with the proper action.
	 *
	 * @param {string} resource - The resource for which the routes should be created.
	 * @param {string} controller - The resource controller name that will handle requests.
	 * @param {Array<string>} [only] - Indicates the routes restrictions.
	 * @param {boolean} [apiOnly=false] - Indicates that only API routes should be considered.
	 * @returns {http.services.Router} The current router instance.
	 */
	resource(resource, controller, only = [], apiOnly = false) {
		this.getResourceMapping(resource, controller)
			.filter(({ name, api }) => {
				return (only.length === 0 || only.includes(name)) && (!apiOnly || api);
			})
			.forEach(({ name, method, url, action }) => {
				this.addRoute(method, url, action).name(`${resource}.${name}`);
			});

		return this;
	}

	/**
	 * Create API resource routes, without "create" and "edit" routes, which normally show form.
	 * Uses the same controller for each resource route with the proper action.
	 *
	 * @param {string} resource - The resource for which the routes should be created.
	 * @param {string} controller - The resource controller name that will handle requests.
	 * @param {Array<string>} [only=[]] - Indicates the routes restrictions.
	 * @returns {http.services.Router} The current router instance.
	 */
	apiResource(resource, controller, only = []) {
		return this.resource(resource, controller, only, true);
	}

	/**
	 * Create a route group.
	 *
	 * @param {http.GroupOptions} options - The group options.
	 * @param {Function} group - The group closure.
	 * @returns {http.services.Router} The current router instance.
	 */
	group(options, group) {
		const data = __(this).get('groups');
		const index = data.push(options) - 1;
		group(this, this.app);
		data.splice(index, 1);

		return this;
	}

	/**
	 * Add a route in the route repository.
	 *
	 * @param {string} method - The HTTP verb, such as "GET", "POST", "DELETE", etc.
	 * @param {string} path - The route path.
	 * @param {string|Function} action - The action that will handle the request.
	 * @returns {http.Route} The newly created route instance.
	 */
	addRoute(method, path, action) {
		const route = this.makeRoute({ method, path, action });
		this.routes.add(route);

		return route;
	}

	/**
	 * Create a new route instance.
	 *
	 * @param {http.RouteAttributes} attributes - The route attributes.
	 * @returns {http.Route} The newly created route instance.
	 */
	makeRoute(attributes) {
		const data = { asPrefix: '', path: '', action: '' };

		[...__(this).get('groups'), attributes].forEach((current) => {
			Object.entries(this.getRouteMapping(current))
				.forEach(([key, value]) => {
					data[key] = `${data[key] || ''}${value}`;
				});
		});

		const { method, action } = attributes;

		data.method = method;

		if (typeof action === 'function') {
			data.action = action;
		}

		return new Route(data);
	}

	/**
	 * Get route or route group mapping.
	 *
	 * @param {http.Route} route - The route instance.
	 * @returns {http.RouteAttributes} The route mapping.
	 */
	getRouteMapping(route) {
		return {
			asPrefix: this.getRouteAsPrefixMapping(route),
			path:     this.getRoutePathMapping(route),
			action:   this.getRouteActionMapping(route)
		};
	}

	/**
	 * Get route or route group asPrefix mapping.
	 *
	 * @param {http.Route} route - The route instance.
	 * @returns {string} The route name prefix.
	 */
	getRouteAsPrefixMapping({ as }) {
		return as || '';
	}

	/**
	 * Get route or route group path mapping.
	 *
	 * @param {http.Route} route - The route instance.
	 * @returns {string} The full route path.
	 */
	getRoutePathMapping({ prefix, path }) {
		const formattedPath = (prefix || path || '')
			.split('/')
			.filter((part) => {
				return Boolean(part);
			})
			.join('/');

		return formattedPath ? `/${formattedPath}` : '';
	}

	/**
	 * Get route or route group action mapping.
	 *
	 * @param {http.Route} route - The route instance.
	 * @returns {string} The route action name.
	 */
	getRouteActionMapping({ namespace, action }) {
		const formattedNamespace = (namespace || '')
			.replace(/(?<last>\w)$/u, `$<last>${this.controllers.namespaceSeparator}`);

		return formattedNamespace || (typeof action === 'string' ? action : '') || '';
	}

	/**
	 * Generate route binding in Express server.
	 *
	 * @returns {express.Router} The Express Router instance.
	 */
	generate() {
		if (!__(this).get('expressRouter')) {
			const router = this.server.getRouter();

			this.post('/allo', (request, response) => {
				response.send('bob');
			});
			this.routes.all().forEach((route) => {
				const { constraints, path, method } = route;

				router[method](this.resolvePath(path, constraints), (request, response) => {
					return this.routerHandler.handleRequest(route, request, response);
				});
			});

			router.all('*', this.routerHandler.handleRouteNotFound.bind(this.routerHandler));

			__(this).set('expressRouter', router);
		}

		return __(this).get('expressRouter');
	}

	/**
	 * Call the route handler.
	 *
	 * @param {string} path - The route path.
	 * @param {string} [method] - The HTTP method to use.
	 * @param {*} [request] - The request instance to use.
	 * @returns {Promise} The async process promise.
	 */
	call(path, method = 'get', request = {}) {
		return this.runMiddleware(path, { ...request, method });
	}

	/**
	 * Manually run middleware to programmatically process an internal request.
	 *
	 * @param {string} path - The route path.
	 * @param {request} request - The request instance to use.
	 * @returns {Promise<{code: number, data: *}>} The HTTP code result and the response body.
	 */
	runMiddleware(path, request) {
		const server = this.server.make().use(this.generate());

		return new Promise((resolve, reject) => {
			server.runMiddleware(path, request, this.routerHandler.getInternalCallResultHandler(resolve, reject));
		});
	}

	/**
	 * Call the route handler associated with the given name.
	 *
	 * @param {string} name - The route name.
	 * @param {object} [parameters={}] - The route parameters.
	 * @param {object|request} [request={}] - The request instance to use.
	 * @returns {Promise} The async process promise.
	 */
	callByName(name, parameters = {}, request = {}) {
		const route = this.routes.findByName(name);
		const { compiledPath: path, method } = route.compilePath(parameters);

		return this.call(path, method, request);
	}

	/**
	 * Get the resource mapping data.
	 *
	 * @param {string} resource - The resource from which to get the mapping.
	 * @param {string} controller - The controller name.
	 * @returns {Array<object>} The List of resource action mapping.
	 */
	getResourceMapping(resource, controller) {
		return this.getResourceActions().map((action) => {
			return {
				...action,
				...this.getResourceData(resource, controller, action.name)
			};
		});
	}

	/**
	 * Get single resource route data.
	 *
	 * @param {string} resource - The resource from which to get data.
	 * @param {string} controller - The controller name.
	 * @param {string} action - The controller action name.
	 * @returns {http.ResourceData} The resource data.
	 */
	getResourceData(resource, controller, action) {
		return {
			name:   action,
			method: this.getResourceActionMethod(action),
			url:    this.getResourceUrlMapping(resource, action),
			action: `${controller}@${action}`
		};
	}

	/**
	 * Get available resource actions.
	 *
	 * @returns {Array<{name: string, method: string, single: boolean}>} The resource actions.
	 */
	getResourceActions() {
		return [
			{ name: 'index',   method: 'get',    single: false, api: true,  suffix: '' },
			{ name: 'create',  method: 'get',    single: false, api: false, suffix: '/create' },
			{ name: 'store',   method: 'post',   single: false, api: true,  suffix: '' },
			{ name: 'show',    method: 'get',    single: true,  api: true,  suffix: '' },
			{ name: 'edit',    method: 'get',    single: true,  api: false, suffix: '/edit' },
			{ name: 'update',  method: 'patch',  single: true,  api: true,  suffix: '' },
			{ name: 'destroy', method: 'delete', single: true,  api: true,  suffix: '' }
		];
	}

	/**
	 * Get single resource action data.
	 *
	 * @param {string} action - The action name.
	 * @returns {http.ResourceAction} The resource action.
	 */
	getResourceAction(action) {
		return this.getResourceActions().find(({ name }) => {
			return name === action;
		});
	}

	/**
	 * Get single resource action method name.
	 *
	 * @param {string} action - The action name.
	 * @returns {string} The resource action HTTP method.
	 */
	getResourceActionMethod(action) {
		return (this.getResourceAction(action) || {}).method;
	}

	/**
	 * Get single resource action URL mapping.
	 *
	 * @param {string} resource - The resource name.
	 * @param {string} action - The resource action.
	 * @returns {string} The URL for the resource for the specific action.
	 */
	getResourceUrlMapping(resource, action) {
		const { single, suffix } = this.getResourceAction(action);

		let uri = resource;

		if (single) {
			uri = `${resource}/:${resource}`;
		}

		if (!suffix) {
			return uri;
		}

		return `${uri}${this.app.isBound('translator') ? this.app.make('translator').translate(suffix) : suffix}`;
	}

	/**
	 * Resolve Express path based on given path and parameter constraints.
	 *
	 * @param {string} path - The route path.
	 * @param {*} constraints - The constraints for route parameters.
	 * @returns {string} The resolved path.
	 */
	resolvePath(path, constraints) {
		return Object.entries(constraints)
			.reduce((string, [parameter, constraint]) => {
				return string.replace(new RegExp(`:${parameter}(?<slash>/?)`, 'u'), `:${parameter}${constraint ? `(${constraint})` : ''}`);
			}, path);
	}

	/**
	 * Get server instance.
	 *
	 * @returns {Express} The Express server instance.
	 */
	getServer() {
		return this.server.getInstance();
	}

	/**
	 * Route repository.
	 *
	 * @type {http.repositories.RouteRepository}
	 */
	get routes() {
		return __(this).get('router.route');
	}

	/**
	 * Controller repository.
	 *
	 * @type {http.repositories.ControllerRepository}
	 */
	get controllers() {
		return __(this).get('router.controller');
	}

}


export default Router;
