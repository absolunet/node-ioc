"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Repositories - Route Repository
//--------------------------------------------------------

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
    (0, _privateRegistry.default)(this).set('routes', []);
  }
  /**
   * Add a route instance.
   *
   * @param {http.Route} route - The route instance to add.
   * @returns {http.repositories.RouteRepository} The current route repository instance.
   */


  add(route) {
    (0, _privateRegistry.default)(this).get('routes').push(route);
    return this;
  }
  /**
   * Get all route instances.
   *
   * @returns {Array<Route>} A list of all the registered routes.
   */


  all() {
    return [...(0, _privateRegistry.default)(this).get('routes')];
  }
  /**
   * Find a route by given name.
   *
   * @param {string} name - The route name.
   * @returns {http.Route|null} The found route instance, or null if not found.
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
   * @returns {Array<Route>} A list of routes that match the given path.
   */


  findByPath(path) {
    return this.all().filter(route => {
      const {
        path: pattern
      } = route;
      const regex = pattern.replace(/:(?<name>\w+)/ug, (match, name) => {
        const constraint = route.constraints[name] || '[^/]+';
        return `(?<${name}>${constraint})`;
      });
      return new RegExp(`^${regex}$`, 'u').test(path);
    });
  }
  /**
   * Find a route by path and method.
   *
   * @param {string} path - The route path.
   * @param {string} method - The HTTP method.
   * @returns {http.Route|null} The found route instance, or null if not found.
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

var _default = RouteRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;