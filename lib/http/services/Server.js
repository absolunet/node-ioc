//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Server
//--------------------------------------------------------
'use strict';


class Server {

	/**
	 * Make a server instance.
	 *
	 * @returns {Express}
	 */
	make() {
		return this.applyMiddleware(this.express());
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
