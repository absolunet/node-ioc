//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('./../../foundation/ServiceProvider');
const StringHelper    = require('../helpers/String');


class SupportServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.bind('helper.string', StringHelper);
	}

}


module.exports = SupportServiceProvider;
