//--------------------------------------------------------
//-- Node IoC - Routing - Repositories - Route Repository
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class RouteRepository {

	/**
	 * RouteRepository constructor.
	 */
	constructor() {
		__(this).set('routes', []);
	}

	/**
	 * Add a route instance.
	 *
	 * @param {Route} route
	 */
	add(route) {
		this.all().push(route);
	}

	/**
	 * Get all route instances.
	 *
	 * @returns {Array<Route>}
	 */
	all() {
		return __(this).get('routes');
	}

	/**
	 * Find a route by given name.
	 *
	 * @param {string} name
	 * @returns {Route|null}
	 */
	findByName(name) {
		return this.all().find((route) => {
			return route.getAttribute('as') === name;
		}) || null;
	}

	/**
	 * Find routes that match given path.
	 *
	 * @param {string} path
	 * @returns {Route[]}
	 */
	findByPath(path) {
		return this.all().filter((route) => {
			const pattern = route.getAttribute('path');
			const regex = new RegExp(pattern.replace(/:(?<name>\w+)/ug, (match, name, index) => {
				const constraint = route.getAttribute('constraints')[name] || '[^\/]+';
				const end = pattern.length - index - match.length === 0;

				return `(?<${name}>${constraint})${end ? '$' : ''}`;
			}));

			return regex.test(path);
		});
	}

	/**
	 * Finde a route by path and method.
	 *
	 * @param {string} path
	 * @param {string} method
	 * @returns {Route|null}
	 */
	findByPathForMethod(path, method) {
		const route = this.findByPath(path)
			.find((route) => {
				return route.getAttribute('method') === method;
			});

		if (!route) {
			return null;
		}

		route.setAttribute('compiledPath', path);

		return route;
	}

}

module.exports = RouteRepository;
