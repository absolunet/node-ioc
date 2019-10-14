//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Handler
//--------------------------------------------------------
'use strict';

const __          = require('@absolunet/private-registry');
const checksTypes = require('../../support/mixins/checksTypes');


/**
 * Route handler that handle all the pipeline from request to response.
 *
 * @memberof http.services
 * @augments support.mixins.CheckTypes
 * @hideconstructor
 */
class Handler extends checksTypes() {

	/**
	 * Class dependencies.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config', 'router.controller']);
	}

	/**
	 * Handle HTTP request.
	 *
	 * @param {Route} route - Current route instance.
	 * @param {request} request - Current request instance.
	 * @param {response} response - Current response instance.
	 * @returns {Promise<response>} - The processed response.
	 */
	async handleRequest(route, request, response) {
		this.prepareHandling({ route, request, response });
		const { action } = route;

		try {
			if (this.isFunction(action)) {
				await this.handleRequestWithClosure();
			} else {
				await this.handleRequestWithController();
			}
		} catch (error) {
			await this.handleRequestException(error);
		}

		return this.terminateHandling();
	}

	/**
	 * Handle current request with give promise or result.
	 *
	 * @param {Promise<*>|*} promise - The current request process.
	 * @returns {Promise<*>} - The promise that resolves by either the request completion or by a timeout.
	 */
	handleRequestWith(promise) {
		return Promise.race([promise, this.getHttpTimeoutPromise()]);
	}

	/**
	 * Handle current request with closure attached to route.
	 *
	 * @returns {Promise<*>} - The request handling process.
	 */
	handleRequestWithClosure() {
		return this.handleRequestWith(this.route.action(this.request, this.response));
	}

	/**
	 * Handle current request with controller attached to route.
	 *
	 * @returns {Promise<*>} - The request handling process.
	 */
	handleRequestWithController() {
		return this.handleRequestWith(this.callControllerAction());
	}

	/**
	 * Get an internal call result handler to either resolve or
	 * reject the given request based on received HTTP code.
	 *
	 * @param {Function} resolve - The promise resolving.
	 * @param {Function} reject - The promise rejection.
	 * @returns {Function} - The internal call result handler.
	 */
	getInternalCallResultHandler(resolve, reject) {
		return (code, data) => {
			const payload = { code, data };

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
		__(this).set('handling', objects);
	}

	/**
	 * Terminate request handling.
	 *
	 * @returns {response} - The current response.
	 */
	terminateHandling() {
		const { response } = this;
		__(this).set('handling', {});

		return response;
	}

	/**
	 * Handle exception that occurred during request handling.
	 *
	 * @param {Error} exception - The throw exception.
	 * @returns {response} - The current response.
	 */
	handleRequestException(exception) {
		const exceptionHandler = this.app.make('exception.handler');
		exceptionHandler.handle(exception, this.request, this.response);

		return this.response;
	}

	/**
	 * Call route controller action.
	 *
	 * @returns {Promise<*>|*} - The request handling process.
	 */
	callControllerAction() {
		const { action: name, defaults } = this.route;
		const action = this.resolveControllerAction(name);

		return action(defaults);
	}

	/**
	 * Resolve controller action method.
	 *
	 * @returns {Function} - The bound controller method.
	 */
	resolveControllerAction() {
		const { action: name } = this.route;
		const controller       = this.routerController.get(name);
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
	 * @returns {Promise<Error>} - The promise of a timeout error.
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
	 * @returns {Error} - The timeout error.
	 */
	getHttpTimeoutException() {
		return new Error('Timeout');
	}

	/**
	 * Throw custom TypeError indicating that the controller action was not found.
	 *
	 * @param {string} controller - The controller action.
	 * @throws TypeError - Indicates that the action was not found in the given controller.
	 */
	throwControllerActionNotFound(controller) {
		const name   = this.routerController.resolveName(controller);
		const method = this.routerController.resolveAction(controller);

		throw new TypeError(`Action "${method}" in controller "${name}" does not exists.`);
	}

	/**
	 * The current route.
	 *
	 * @type {Route}
	 */
	get route() {
		return __(this).get('handling').route;
	}

	/**
	 * The current request.
	 *
	 * @type {request}
	 */
	get request() {
		return __(this).get('handling').request;
	}

	/**
	 * The current response.
	 *
	 * @type {response}
	 */
	get response() {
		return __(this).get('handling').response;
	}

}

module.exports = Handler;
