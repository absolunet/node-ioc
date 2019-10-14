//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Server
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


/**
 * HTTP server class that decorates Express server and router.
 *
 * @memberof http.services
 * @hideconstructor
 */
class Server {

	/**
	 * Make a new server instance.
	 *
	 * @param {boolean} [unique=false] - Indicates that the servers hould be a unique one and not set as a singleton.
	 * @returns {Express} - Newly created Express server instance.
	 */
	make(unique = false) {
		const server = this.applyMiddleware(this.express());

		if (!this.hasInstance() && !unique) {
			this.setDefaultInstance(server);
		}

		return server;
	}

	/**
	 * Get an existing server instance if exists or a fresh one otherwise.
	 *
	 * @returns {Express} - Existing or newly created Express server instance.
	 */
	getInstance() {
		return this.hasInstance() ? __(this).get('instance') : this.make();
	}

	/**
	 * Set default server instance.
	 *
	 * @param {Express} server - The Express server instance.
	 * @returns {Server} - The current server instance.
	 */
	setDefaultInstance(server) {
		__(this).set('instance', server);

		return this;
	}

	/**
	 * Check if an instance already exists.
	 *
	 * @returns {boolean} - Indicates that an Express server was already instantiated.
	 */
	hasInstance() {
		return Boolean(__(this).get('instance'));
	}

	/**
	 * Get Express router.
	 *
	 * @returns {express.Router} - Express router instance.
	 */
	getRouter() {
		return this.express.Router();
	}

	/**
	 * Apply middleware to given server instance.
	 *
	 * @param {Express} server - Express server instance.
	 * @returns {Express} - Express server instance with applied middleware.
	 */
	applyMiddleware(server) {
		require('run-middleware')(server); // eslint-disable-line global-require
		server.use(this.express.json());
		server.use(this.express.urlencoded({ extended: true }));
		server.use(this.methodOverride(this.methodOverrideParser));

		return server;
	}

	/**
	 * Method override parser callback accessor.
	 *
	 * @type {Function}
	 */
	get methodOverrideParser() {
		return (request) => {
			if (request.body && typeof request.body === 'object' && '_method' in request.body) {
				const { _method: method } = request.body;
				delete request.body._method;

				return method.toUpperCase();
			}

			return request.method;
		};
	}

	/**
	 * The method-override module.
	 *
	 * @type {Function}
	 */
	get methodOverride() {
		return require('method-override'); // eslint-disable-line global-require
	}

	/**
	 * The Express module.
	 *
	 * @type {Express}
	 */
	get express() {
		return require('express'); // eslint-disable-line global-require
	}

}

module.exports = Server;
