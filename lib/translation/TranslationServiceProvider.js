//--------------------------------------------------------
//-- Node IoC - Translation - Translation Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Translator = require('./services/Translator');


class TranslationServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('translator', Translator);
	}

}


module.exports = TranslationServiceProvider;
