//--------------------------------------------------------
//-- Node IoC - Translation - Translation Service Provider
//--------------------------------------------------------
'use strict';

const Translator       = require('../services/Translator');
const ServiceProvider = require('../../foundation/ServiceProvider');


class TranslationServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('translator', Translator);
	}

}


module.exports = TranslationServiceProvider;
