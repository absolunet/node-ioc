//--------------------------------------------------------
//-- Node IoC - HTTP - Repositories - Route Repository
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');
/**
 * Route repository that stores all the routes made from the router.
 *
 * @memberof http.repositories
 * @hideconstructor
 */


class RouteRepository {
  /**
   * @inheritdoc
   * @private
   */
  init() {
    __(this).set('routes', []);
  }
  /**
   * Add a route instance.
   *
   * @param {Route} route - The route instance to add.
   * @returns {RouteRepository} - The current route repository instance.
   */


  add(route) {
    __(this).get('routes').push(route);

    return this;
  }
  /**
   * Get all route instances.
   *
   * @returns {Array<Route>} - A list of all the registered routes.
   */


  all() {
    return [...__(this).get('routes')];
  }
  /**
   * Find a route by given name.
   *
   * @param {string} name - The route name.
   * @returns {Route|null} - The found route instance, or null if not found.
   */


  findByName(name) {
    return this.all().find(({
      as
    }) => {
      return as === name;
    }) || null;
  }
  /**
   * Find routes that match given path.
   *
   * @param {string} path - The route path.
   * @returns {Array<Route>} - A list of routes that match the given path.
   */


  findByPath(path) {
    return this.all().filter(route => {
      const {
        path: pattern
      } = route;
      const regex = pattern.replace(/:(?<name>\w+)/ug, (match, name, index) => {
        const constraint = route.constraints[name] || '[^/]+';
        const end = pattern.length - index - match.length === 0;
        return `(?<${name}>${constraint})${end ? '$' : ''}`;
      });
      return new RegExp(regex, 'u').test(path);
    });
  }
  /**
   * Find a route by path and method.
   *
   * @param {string} path - The route path.
   * @param {string} method - The HTTP method.
   * @returns {Route|null} - The found route instance, or null if not found.
   */


  findByPathForMethod(path, method) {
    const route = this.findByPath(path).find(({
      method: routeMethod
    }) => {
      return routeMethod.toLowerCase() === method.toLowerCase();
    });

    if (!route) {
      return null;
    }

    route.compiledPath = path;
    return route;
  }

}

module.exports = RouteRepository;