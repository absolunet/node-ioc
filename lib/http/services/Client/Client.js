//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Client - HTTP Client
//--------------------------------------------------------
'use strict';


const axios = require('axios');
const ClientProxy = require('./ClientProxy');


class Client {

	/**
	 * HTTP Client constructor.
	 */
	constructor() {
		return new Proxy(axios.create(), new ClientProxy());
	}

}

module.exports = Client;
