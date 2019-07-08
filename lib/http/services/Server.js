//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Server
//--------------------------------------------------------
'use strict';

const express       = require('express');
const runMiddleware = require('run-middleware');


class Server {

	/**
	 * Make a server instance.
	 *
	 * @returns {Express}
	 */
	make() {
		return this.applyMiddleware(express());
	}

	/**
	 * Apply middleware to given server instance.
	 *
	 * @param {Express} server
	 * @returns {Express}
	 */
	applyMiddleware(server) {
		runMiddleware(server);

		return server;
	}

}

module.exports = Server;
