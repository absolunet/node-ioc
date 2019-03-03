//--------------------------------------------------------
//-- Node IoC - Foundation - Service Provider
//--------------------------------------------------------
'use strict';


class ServiceProvider {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Service provider constructor.
	 *
	 * @param {Container} app
	 */
	constructor(app) {
		this.app = app;
	}

}

module.exports = ServiceProvider;
