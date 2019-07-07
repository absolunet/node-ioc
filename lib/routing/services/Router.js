//--------------------------------------------------------
//-- Node IoC - Routing - Services - Router
//--------------------------------------------------------
'use strict';

const __    = require('@absolunet/private-registry');
const Route = require('./../models/Route');


class Router {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['server', 'route.repository', 'route.controller'];
	}

	/**
	 * Router constructor.
	 */
	constructor() {
		__(this).set('groups', []);
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
		return this.any(from, 'default@redirect')
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
		group();
		data.splice(index, 1);
	}

	/**
	 * Add a route in the route repository.
	 *
	 * @param {string} method
	 * @param {string} path
	 * @param {string|Function} action
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
		const data = [...__(this).get('groups'), attributes]
			.reduce((route, { as, prefix, path, namespace, action }) => {
				route.asPrefix += as || '';
				route.path += prefix || path || '';
				route.action += namespace || (typeof action === 'string' ? action : '') || '';

				return route;
			}, { asPrefix: '', path: '', action: '' });

		data.method = attributes.method;
		if (typeof attributes.action === 'function') {
			data.action = attributes.action;
		}

		return Route.new(data);
	}

	/**
	 * Generate route binding in Express server.
	 *
	 * @returns {Express}
	 */
	generate() {
		const server = this.server.make();

		this.routes.all().forEach(({ constraints, defaults, path, action, method }) => {
			server[method](this.resolvePath(path, constraints), (request, response) => {
				if (typeof action === 'function') {
					return action(request, response);
				}

				const controller = this.controllers.get(action);
				const controllerMethod = this.controllers.resolveAction(action);

				controller.prepareHandling(request, response);

				return controller[controllerMethod](defaults);
			});
		});

		return server;
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
				return string.replace(new RegExp(`:${parameter}(?<slash>/?)`, 'u'), `:${parameter}(${constraint})`);
			}, path);
	}

	/**
	 * @type {RouteRepository}
	 */
	get routes() {
		return __(this).get('route.repository');
	}

	/**
	 * @type {ControllerRepository}
	 */
	get controllers() {
		return __(this).get('route.controller');
	}

}

module.exports = Router;
