//--------------------------------------------------------
//-- Node IoC - Routing - Services - Router
//--------------------------------------------------------
'use strict';

const __    = require('@absolunet/private-registry');
const Route = require('../models/Route');


class Router {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'config', 'server', 'router.handler', 'router.route', 'router.controller'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('groups', []);
		__(this).set('generated', false);
	}

	/**
	 * Register a new GET route with the router.
	 *
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	get(path, action) {
		return this.addRoute('get', path, action);
	}

	/**
	 * Register a new POST route with the router.
	 *
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	post(path, action) {
		return this.addRoute('post', path, action);
	}

	/**
	 * Register a new PUT route with the router.
	 *
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	put(path, action) {
		return this.addRoute('put', path, action);
	}

	/**
	 * Register a new PATCH route with the router.
	 *
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	patch(path, action) {
		return this.addRoute('patch', path, action);
	}

	/**
	 * Register a new DELETE route with the router.
	 *
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	delete(path, action) {
		return this.addRoute('delete', path, action);
	}

	/**
	 * Register a new route responding to all verbs.
	 *
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	any(path, action) {
		return this.addRoute('all', path, action);
	}

	/**
	 * Register a new route responding to all verbs.
	 *
	 * @param path
	 * @param action
	 * @returns {Route}
	 */
	all(path, action) {
		return this.any(path, action);
	}

	/**
	 * Register a fallback route that matches anything in the current scope.
	 *
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	fallback(action) {
		return this.any('*', action);
	}

	/**
	 * Create a redirection route.
	 * The redirection can either be permanent or temporary.
	 *
	 * @param {string} from
	 * @param {string} to
	 * @param {boolean} [permanent]
	 * @returns {Route}
	 */
	redirect(from, to, permanent = false) {
		return this.any(from, this.withCorePrefix('RedirectController@handle'))
			.with('to', to)
			.with('permanent', permanent);
	}

	/**
	 * Create a permanent redirection route.
	 * @param {string} from
	 * @param {string} to
	 * @returns {Route}
	 */
	permanentRedirect(from, to) {
		return this.redirect(from, to, true);
	}

	/**
	 * Register a static path for files.
	 *
	 * @param {string} path
	 * @param {string} folder
	 * @returns {Route}
	 */
	static(path, folder) {
		return this.get(`${path}/:file`, this.withCorePrefix('StaticController@handle'))
			.where('file', '*')
			.with({ path, folder });
	}

	/**
	 * Get controller name with core prefix.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	withCorePrefix(name) {
		const { coreNamespace: n, namespaceSeparator: s } = this.controllers;

		return `${n}${s}${name}`;
	}

	/**
	 * Add a controller binding.
	 *
	 * @param {string} name
	 * @param {Controller} controller
	 * @returns {ControllerRepository}
	 */
	controller(name, controller) {
		return this.controllers.add(name, controller);
	}

	/**
	 * Create a controller group.
	 *
	 * @param {string} namespace
	 * @param {Function} group
	 * @returns {ControllerRepository}
	 */
	controllerGroup(namespace, group) {
		return this.controllers.group(namespace, group);
	}

	/**
	 * Create resource routes.
	 * Uses the same controller for each resource route with the proper action.
	 *
	 * @param {string} resource
	 * @param {string} controller
	 * @param {Array<string>} [only]
	 *
	 * @returns {Router}
	 */
	resource(resource, controller, only = []) {
		const mapping = this.getResourceMapping(resource, controller);

		if (only.length === 0) {
			return mapping;
		}

		mapping
			.filter(({ name }) => {
				return only.includes(name);
			})
			.forEach(({ name, method, url, action }) => {
				this.addRoute(method, url, action).name(`${resource}.${name}`);
			});

		return this;
	}

	/**
	 * Create a route group.
	 *
	 * @param {{ as?: string, prefix?: string, namespace?: string }} options
	 * @param {Function} group
	 */
	group(options, group) {
		const data = __(this).get('groups');
		const index = data.push(options) - 1;
		group(this, this.app);
		data.splice(index, 1);
	}

	/**
	 * Add a route in the route repository.
	 *
	 * @param {string} method
	 * @param {string} path
	 * @param {string|Function} action
	 * @returns {Route}
	 */
	addRoute(method, path, action) {
		const route = this.newRoute({ method, path, action });
		this.routes.add(route);

		return route;
	}

	/**
	 * Create a new route instance.
	 *
	 * @param {{ method?: string, path?: string, action?: string/Function }} attributes
	 * @returns {Route}
	 */
	newRoute(attributes) {
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
	 * @param route
	 * @returns {{path: string, action: string, asPrefix: string}}
	 */
	getRouteMapping(route) {
		return {
			asPrefix: this.getRouteAsPrefixMapping(route),
			path: this.getRoutePathMapping(route),
			action: this.getRouteActionMapping(route)
		};
	}

	/**
	 * Get route or route group asPrefix mapping.
	 *
	 * @param {Route} route
	 * @returns {string}
	 */
	getRouteAsPrefixMapping({ as }) {
		return as || '';
	}

	/**
	 * Get route or route group path mapping.
	 *
	 * @param {Route} route
	 * @returns {string}
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
	 * @param {Route} route
	 * @returns {string}
	 */
	getRouteActionMapping({ namespace, action }) {
		const formattedNamespace = (namespace || '')
			.replace(/(?<last>\w)$/u, `$<last>${this.controllers.namespaceSeparator}`);

		return formattedNamespace || (typeof action === 'string' ? action : '') || '';
	}

	/**
	 * Generate route binding in Express server.
	 *
	 * @returns {Express}
	 */
	generate() {
		const server = this.getServer();

		if (!__(this).get('generated')) {
			this.routes.all().forEach((route) => {
				const { constraints, path, method } = route;

				server[method](this.resolvePath(path, constraints), (request, response) => {
					return this.handler.handleRequest(route, request, response);
				});
			});

			__(this).set('generated', true);
		}

		return server;
	}

	/**
	 * Call the route handler.
	 *
	 * @param {string} path
	 * @param {string} [method]
	 * @param {*} [request]
	 */
	call(path, method = 'get', request = {}) {
		return this.runMiddleware(path, { ...request, method });

	}

	/**
	 * Manually run middleware to programmatically process an internal request.
	 *
	 * @param {string} path
	 * @param {request} request
	 * @returns {Promise<any>}
	 */
	runMiddleware(path, request) {
		const server = this.generate();

		return new Promise((resolve, reject) => {
			server.runMiddleware(path, request, this.handler.getInternalCallResultHandler(resolve, reject));
		});
	}

	/**
	 * Call the route handler associated with the given name.
	 *
	 * @param {string} name
	 * @param {*} [parameters]
	 * @param {*} [request]
	 */
	callByName(name, parameters = {}, request = {}) {
		const route = this.routes.findByName(name);
		const { compiledPath: path, method } = route.compilePath(parameters);

		return this.call(path, method, request);
	}

	/**
	 * Get the resource mapping data.
	 *
	 * @param {string} resource
	 * @param {string} controller
	 * @returns {Array<{name: string, method: string, url: string, action: string}>}
	 */
	getResourceMapping(resource, controller) {
		return this.getResourceActions().map(({ name }) => {
			return this.getResourceData(resource, controller, name);
		});
	}

	/**
	 * Get single resource route data.
	 *
	 * @param {string} resource
	 * @param {string} controller
	 * @param {string} action
	 * @returns {{method: *, name: *, action: string, url: (string|*)}}
	 */
	getResourceData(resource, controller, action) {
		return {
			name: action,
			method: this.getResourceActionMethod(action),
			url: this.getResourceUrlMapping(resource, action),
			action: `${controller}@${action}`
		};
	}

	/**
	 * Get available resource actions.
	 *
	 * @returns {Array<{name: string, method: string, single: boolean}>}
	 */
	getResourceActions() {
		return [
			{ name: 'index',   method: 'get',    single: false },
			{ name: 'store',   method: 'post',   single: false },
			{ name: 'show',    method: 'get',    single: true },
			{ name: 'update',  method: 'patch',  single: true },
			{ name: 'destroy', method: 'delete', single: true }
		];
	}

	/**
	 * Get single resource action data.
	 *
	 * @param {string} action
	 * @returns {{name: string, method: string, single: boolean}}
	 */
	getResourceAction(action) {
		return this.getResourceActions().find(({ name }) => {
			return name === action;
		});
	}

	/**
	 * Get single resource action method name.
	 *
	 * @param {string} action
	 * @returns {string}
	 */
	getResourceActionMethod(action) {
		return (this.getResourceAction(action) || {}).method;
	}

	/**
	 * Get single resource action URL mapping.
	 *
	 * @param {string} resource
	 * @param {string} action
	 * @returns {string}
	 */
	getResourceUrlMapping(resource, action) {
		if (this.getResourceAction(action).single) {
			return `${resource}/:${resource}`;
		}

		return resource;
	}

	/**
	 * Resolve Express path based on given path and parameter constraints.
	 *
	 * @param {string} path
	 * @param {*} constraints
	 * @returns {string}
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
	 * @returns {Express}
	 */
	getServer() {
		const key = 'router.server';
		if (!__(this).get(key)) {
			__(this).set(key, this.server.make());
		}

		return __(this).get(key);
	}

	/**
	 * @type {Container}
	 */
	get app() {
		return __(this).get('app');
	}

	/**
	 * @type {ConfigRepository}
	 */
	get config() {
		return __(this).get('config');
	}

	/**
	 * @type {Handler}
	 */
	get handler() {
		return __(this).get('router.handler');
	}

	/**
	 * @type {RouteRepository}
	 */
	get routes() {
		return __(this).get('router.route');
	}

	/**
	 * @type {ControllerRepository}
	 */
	get controllers() {
		return __(this).get('router.controller');
	}

}

module.exports = Router;
