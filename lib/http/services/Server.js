//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Server
//--------------------------------------------------------
'use strict';

const express = require('express');


class Server {

	/**
	 * Make a server instance.
	 *
	 * @returns {app}
	 */
	make() {
		return express();
	}

}

module.exports = Server;
