//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Client
//--------------------------------------------------------


/**
 * HTTP client.
 *
 * @memberof http.services
 * @hideconstructor
 */
class Client {

	/**
	 * HTTP Client constructor.
	 */
	constructor() {
		return require('axios').create(); // eslint-disable-line global-require
	}

}


export default Client;
