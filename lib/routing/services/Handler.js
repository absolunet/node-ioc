//--------------------------------------------------------
//-- Node IoC - Routing - Services - Handler
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Handler {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'config', 'router.controller'];
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
			if (typeof action === 'function') {
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
	 * Handle current request with closure attached to route.
	 *
	 * @returns {*|Promise<*>}
	 */
	handleRequestWithClosure() {
		const { action } = this.route;

		return action(this.request, this.response);
	}

	/**
	 * Handle current request with controller attached to route.
	 *
	 * @returns {Promise<response>}
	 */
	handleRequestWithController() {
		return Promise.race([
			this.callControllerAction(),
			this.getHttpTimeoutPromise()
		]);
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
		exceptionHandler.handle(exception);
		exceptionHandler.render(exception, this.request, this.response);

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

		if (typeof action !== 'function') {
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
			}, this.config.get('request.timeout', 30000));
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
		const name   = this.controllers.getControllerName(controller);
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
	 * @type {ControllerRepository}
	 */
	get controllers() {
		return __(this).get('router.controller');
	}

}

module.exports = Handler;
