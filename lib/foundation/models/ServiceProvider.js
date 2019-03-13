//--------------------------------------------------------
//-- Node IoC - Foundation - Service Provider Model
//--------------------------------------------------------
'use strict';


class ServiceProviderModel {

	/**
	 * Service provider constructor.
	 *
	 * @param {ServiceProvider} provider
	 */
	constructor(provider) {
		this.provider = provider;
		this.registered = false;
		this.booted = false;
		this.instance = null;
	}

}

module.exports = ServiceProviderModel;
