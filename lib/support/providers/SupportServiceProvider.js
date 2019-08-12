//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------
'use strict';

const Faker           = require('../services/Faker');
const ServiceProvider = require('../../foundation/ServiceProvider');
const StringHelper    = require('../helpers/String');


class SupportServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.bind('helper.string', StringHelper);
		this.app.singleton('faker',    Faker);
	}

}


module.exports = SupportServiceProvider;
