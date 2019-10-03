//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Handler
//--------------------------------------------------------
'use strict';

const __          = require('@absolunet/private-registry');
const checksTypes = require('../../support/mixins/checksTypes');


class Handler extends checksTypes() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config', 'router.controller']);
	}

	/**
	 * Handle HTTP request.
	 *
	 * @param {Route} route
	 * @param {request} request
	 * @param {response} response
	 * @returns {Promise<response>}
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
	 * @param {Promise<*>|*}promise
	 * @returns {Promise<*>}
	 */
	handleRequestWith(promise) {
		return Promise.race([promise, this.getHttpTimeoutPromise()]);
	}

	/**
	 * Handle current request with closure attached to route.
	 *
	 * @returns {*|Promise<*>}
	 */
	handleRequestWithClosure() {
		return this.handleRequestWith(this.route.action(this.request, this.response));
	}

	/**
	 * Handle current request with controller attached to route.
	 *
	 * @returns {Promise<response>}
	 */
	handleRequestWithController() {
		return this.handleRequestWith(this.callControllerAction());
	}

	/**
	 * Get an internal call result handler to either resolve or
	 * reject the given request based on received HTTP code.
	 *
	 * @param resolve
	 * @param reject
	 * @returns {Function}
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
	 * @param {{route: Route, request: request, response: response}} objects
	 */
	prepareHandling(objects) {
		__(this).set('handling', objects);
	}

	/**
	 * Terminate request handling.
	 *
	 * @returns {response}
	 */
	terminateHandling() {
		const { response } = this;
		__(this).set('handling', {});

		return response;
	}

	/**
	 * Handle exception that occurred during request handling.
	 *
	 * @param {Error} exception
	 */
	handleRequestException(exception) {
		const exceptionHandler = this.app.make('exception.handler');
		exceptionHandler.handle(exception, this.request, this.response);

		return this.response;
	}

	/**
	 * Call route controller action.
	 *
	 * @returns {*|Promise<*>}
	 */
	callControllerAction() {
		const { action: name, defaults } = this.route;
		const action = this.resolveControllerAction(name);

		return action(defaults);
	}

	/**
	 * Resolve controller action method.
	 *
	 * @returns {Function}
	 */
	resolveControllerAction() {
		const { action: name } = this.route;
		const controller       = this.controllers.get(name);
		const controllerMethod = this.controllers.resolveAction(name);
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
	 * @returns {Promise<TypeError>}
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
	 * @returns {TypeError}
	 */
	getHttpTimeoutException() {
		return new TypeError('Timeout');
	}

	/**
	 * Throw custom TypeError indicating that the controller action was not found.
	 *
	 * @param {string} controller
	 * @throws
	 */
	throwControllerActionNotFound(controller) {
		const name   = this.controllers.resolveName(controller);
		const method = this.controllers.resolveAction(controller);

		throw new TypeError(`Action "${method}" in controller "${name}" does not exists.`);
	}

	/**
	 * @type {Route}
	 */
	get route() {
		return __(this).get('handling').route;
	}

	/**
	 * @type {request}
	 */
	get request() {
		return __(this).get('handling').request;
	}

	/**
	 * @type {response}
	 */
	get response() {
		return __(this).get('handling').response;
	}

	/**
	 * @type {ControllerRepository}
	 */
	get controllers() {
		return this.routerController;
	}

}

module.exports = Handler;
