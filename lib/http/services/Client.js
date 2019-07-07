//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Client - HTTP Client
//--------------------------------------------------------
'use strict';

const axios = require('axios');


class Client {

	/**
	 * HTTP Client constructor.
	 */
	constructor() {
		return axios.create();
	}

}


module.exports = Client;
