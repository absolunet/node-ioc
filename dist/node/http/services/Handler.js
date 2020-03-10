"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _checksTypes = _interopRequireDefault(require("../../support/mixins/checksTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Handler
//--------------------------------------------------------

/**
 * Route handler that handle all the pipeline from request to response.
 *
 * @memberof http.services
 * @augments support.mixins.CheckTypes
 * @hideconstructor
 */
class Handler extends (0, _checksTypes.default)() {
  /**
   * Class dependencies: <code>['app', 'config', 'http.error.mapper', 'router.controller', 'router.route']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'config', 'http.error.mapper', 'router.controller', 'router.route']);
  }
  /**
   * Handle HTTP request.
   *
   * @param {http.Route} route - Current route instance.
   * @param {request} request - Current request instance.
   * @param {response} response - Current response instance.
   * @returns {Promise<response>} The processed response.
   */


  async handleRequest(route, request, response) {
    this.prepareHandling({
      route,
      request,
      response
    });

    try {
      if (this.isFunction(route.action)) {
        await this.handleRequestWithClosure();
      } else {
        await this.handleRequestWithController();
      }
    } catch (error) {
      await this.handleRequestException(error);
    }

    await this.terminateHandling();
    return response;
  }
  /**
   * Handle request when the route was not found.
   *
   * @param {request} request - Current request instance.
   * @param {response} response - Current response instance.
   * @returns {Promise<response>} The processed response.
   */


  handleRouteNotFound(request, response) {
    const action = () => {
      throw this.getErrorInstanceFromHttpStatus(this.routes.findByPath(request.url).length > 0 ? 405 : 404);
    };

    return this.handleRequest({
      action
    }, request, response);
  }
  /**
   * Handle current request with give promise or result.
   *
   * @param {Promise<*>|*} promise - The current request process.
   * @returns {Promise} The async process promise.
   */


  async handleRequestWith(promise) {
    await Promise.race([promise, this.getHttpTimeoutPromise()]);
  }
  /**
   * Handle current request with closure attached to route.
   *
   * @returns {Promise} The async process promise.
   */


  async handleRequestWithClosure() {
    await this.handleRequestWith(this.route.action(this.request, this.response));
  }
  /**
   * Handle current request with controller attached to route.
   *
   * @returns {Promise} The async process promise.
   */


  async handleRequestWithController() {
    await this.handleRequestWith(this.callControllerAction());
  }
  /**
   * Get an internal call result handler to either resolve or
   * reject the given request based on received HTTP code.
   *
   * @param {Function} resolve - The promise resolving.
   * @param {Function} reject - The promise rejection.
   * @returns {Function} The internal call result handler.
   */


  getInternalCallResultHandler(resolve, reject) {
    return (code, data) => {
      const payload = {
        code,
        data
      };

      if (code >= 200 && code < 400) {
        return resolve(payload);
      }

      return reject(payload);
    };
  }
  /**
   * Prepare request handling.
   *
   * @param {{route: Route, request: request, response: response}} objects - The current route, request and response instances.
   */


  prepareHandling(objects) {
    (0, _privateRegistry.default)(this).set('handling', objects);
  }
  /**
   * Terminate request handling.
   *
   * @returns {response} The current response.
   */


  async terminateHandling() {
    const {
      exceptionHandler,
      response
    } = this;

    if (!response.statusCode) {
      response.status(exceptionHandler.hadException ? 500 : 200);
    }

    const {
      statusCode
    } = response;

    if ((statusCode < 200 || statusCode >= 400) && !exceptionHandler.hadException) {
      await this.handleRequestException(this.getErrorInstanceFromHttpStatus(statusCode));
    }

    (0, _privateRegistry.default)(this).set('handling', {});

    if (response.headersSent) {
      response.end();
    } else {
      await new Promise(resolve => {
        response.on('finish', () => {
          resolve();
        });
      });
    }
  }
  /**
   * Handle exception that occurred during request handling.
   *
   * @param {Error} exception - The throw exception.
   * @returns {Promise} The async process promise.
   */


  async handleRequestException(exception) {
    await this.exceptionHandler.handle(exception, this.request, this.response);
  }
  /**
   * Call route controller action.
   *
   * @returns {Promise<*>|*} The request handling process.
   */


  callControllerAction() {
    const {
      action: name,
      defaults
    } = this.route;
    const action = this.resolveControllerAction(name);
    return action(defaults);
  }
  /**
   * Resolve controller action method.
   *
   * @returns {Function} The bound controller method.
   */


  resolveControllerAction() {
    const {
      action: name
    } = this.route;
    const controller = this.routerController.get(name);
    const controllerMethod = this.routerController.resolveAction(name);
    const action = controller[controllerMethod];

    if (!this.isFunction(action)) {
      return this.throwControllerActionNotFound(name);
    }

    controller.prepareHandling(this.app, this.request, this.response);
    return action.bind(controller);
  }
  /**
   * Get HTTP timeout promise.
   * This promise will be rejected after a configured time lapse.
   *
   * @returns {Promise<Error>} The promise of a timeout error.
   */


  getHttpTimeoutPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(this.getHttpTimeoutException());
      }, this.config.get('http.timeout', 30) * 1000);
    });
  }
  /**
   * Get HTTP timeout exception.
   *
   * @returns {http.exceptions.TimeoutHttpError} The timeout error.
   */


  getHttpTimeoutException() {
    return this.getErrorInstanceFromHttpStatus(408);
  }
  /**
   * Throw custom TypeError indicating that the controller action was not found.
   *
   * @param {string} controller - The controller action.
   * @throws {TypeError} Indicates that the action was not found in the given controller.
   */


  throwControllerActionNotFound(controller) {
    const name = this.routerController.resolveName(controller);
    const method = this.routerController.resolveAction(controller);
    throw new TypeError(`Action "${method}" in controller "${name}" does not exists.`);
  }
  /**
   * Get HTTP error that matches the given status.
   *
   * @param {number} status - The HTTP status code.
   * @returns {http.exceptions.HttpError} The HTTP Error that matches the status, or generic error.
   */


  getErrorInstanceFromHttpStatus(status) {
    return this.httpErrorMapper.getErrorInstanceFromHttpStatus(status);
  }
  /**
   * The current route.
   *
   * @type {http.Route}
   */


  get route() {
    return (0, _privateRegistry.default)(this).get('handling').route;
  }
  /**
   * Route repository.
   *
   * @type {http.repositories.RouteRepository}
   */


  get routes() {
    return this.routerRoute;
  }
  /**
   * The current request.
   *
   * @type {request}
   */


  get request() {
    return (0, _privateRegistry.default)(this).get('handling').request;
  }
  /**
   * The current response.
   *
   * @type {response}
   */


  get response() {
    return (0, _privateRegistry.default)(this).get('handling').response;
  }
  /**
   * Application exception handler.
   *
   * @type {foundation.exceptions.Handler}
   */


  get exceptionHandler() {
    return this.app.make('exception.handler');
  }

}

var _default = Handler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;