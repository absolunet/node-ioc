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

}

module.exports = RouteRepository;
