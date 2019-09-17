//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Client - HTTP Client
//--------------------------------------------------------
'use strict';


class Client {

	/**
	 * HTTP Client constructor.
	 */
	constructor() {
		return require('axios').create(); // eslint-disable-line global-require
	}

}


module.exports = Client;
