//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------
'use strict';

const Faker           = require('../services/Faker');
const ServiceProvider = require('../../foundation/ServiceProvider');
const DateHelper      = require('../helpers/Date');
const FileHelper      = require('../helpers/File');
const StringHelper    = require('../helpers/String');


class SupportServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.bind('helper.date',   DateHelper);
		this.app.bind('helper.file',   FileHelper);
		this.app.bind('helper.string', StringHelper);
		this.app.singleton('faker',    Faker);
	}

}


module.exports = SupportServiceProvider;
