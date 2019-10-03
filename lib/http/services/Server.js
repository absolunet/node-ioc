//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Server
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Server {

	/**
	 * Make a new server instance.
	 *
	 * @returns {Express}
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
	 * @returns {Express}
	 */
	getInstance() {
		return this.hasInstance() ? __(this).get('instance') : this.make();
	}

	/**
	 * Set default server instance.
	 *
	 * @param {Express} server
	 * @returns {Server}
	 */
	setDefaultInstance(server) {
		__(this).set('instance', server);

		return this;
	}

	/**
	 * Check if an instance already exists.
	 *
	 * @returns {boolean}
	 */
	hasInstance() {
		return Boolean(__(this).get('instance'));
	}

	/**
	 * Get Express router.
	 *
	 * @returns {express.Router}
	 */
	getRouter() {
		return this.express.Router();
	}

	/**
	 * Apply middleware to given server instance.
	 *
	 * @param {Express} server
	 * @returns {Express}
	 */
	applyMiddleware(server) {
		require('run-middleware')(server); // eslint-disable-line global-require
		server.use(this.express.json());

		return server;
	}

	/**
	 * @type {Express}
	 */
	get express() {
		return require('express'); // eslint-disable-line global-require
	}

}

module.exports = Server;
