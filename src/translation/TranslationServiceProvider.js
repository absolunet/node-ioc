//--------------------------------------------------------
//-- Node IoC - Translation - Translation Service Provider
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('../foundation/ServiceProvider');

const Translator = require('./services/Translator');


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The translation service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="translation.services.Translator.html">translator</a></li>
 * </ul>
 *
 * @memberof translation
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class TranslationServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('translator', Translator);
	}

}


module.exports = TranslationServiceProvider;
