//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Faker        = require('./services/Faker');
const DateHelper   = require('./helpers/DateHelper');
const FileHelper   = require('./helpers/FileHelper');
const PathHelper   = require('./helpers/PathHelper');
const StringHelper = require('./helpers/StringHelper');


class SupportServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.bind('helper.date',   DateHelper);
		this.app.bind('helper.file',   FileHelper);
		this.app.bind('helper.path',   PathHelper);
		this.app.bind('helper.string', StringHelper);
		this.app.singleton('faker',    Faker);
	}

}


module.exports = SupportServiceProvider;
