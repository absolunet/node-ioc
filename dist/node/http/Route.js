"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - HTTP - Models - Route
//--------------------------------------------------------

/**
 * The class that describes a route entity.
 *
 * @memberof http
 */
class Route {
  /**
   * Route constructor.
   *
   * @param {http.RouteAttributes} attributes - Route attributes.
   */
  constructor(attributes) {
    this.as = '';
    this.constraints = {};
    this.defaults = {};
    this.compiledPath = null;
    this.asPrefix = '';
    Object.keys(attributes).forEach(key => {
      this[key] = attributes[key];
    });
  }
  /**
   * Name the route.
   *
   * @param {string} name - The route name.
   * @returns {http.Route} The current route instance.
   */


  name(name) {
    this.as = `${this.asPrefix || ''}${name}`;
    return this;
  }
  /**
   * Compile path from given parameters.
   *
   * @param {object} parameters - The route parameters.
   * @returns {http.Route} The current route instance.
   */


  compilePath(parameters = {}) {
    this.compiledPath = this.path.replace(/:(?<name>\w+)/gu, (match, name) => {
      return parameters[name] || match;
    });
    return this;
  }
  /**
   * Add a constraint to URL parameter.
   * Can either be a constraint object or two parameters, key and value.
   *
   * @param {string|object} constraints - The constraint(s) for the route parameter(s).
   * @returns {http.Route} The current route instance.
   */


  where(...constraints) {
    return this.merge('constraints', constraints);
  }
  /**
   * Give static values to the controller when the route is resolved.
   *
   * Can either be a constraint object or two parameters, key and value.
   *
   * @param {string|object} defaults - The default values that will be injected into the action.
   * @returns {http.Route} The current route instance.
   */


  with(...defaults) {
    return this.merge('defaults', defaults);
  }
  /**
   * Merge given value in route attributes.
   *
   * @param {string} key - The key to merge the data into.
   * @param {Array<string|object>} values - The values to merge.
   * @returns {http.Route} The current route instance.
   */


  merge(key, values) {
    let data;

    if (values.length === 1 && typeof values[0] === 'object') {
      [data] = values;
    } else {
      data = {
        [values[0]]: values[1]
      };
    }

    this[key] = Object.assign({}, this[key] || {}, data);
    return this;
  }

}

var _default = Route;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;