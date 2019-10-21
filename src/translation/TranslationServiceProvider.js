//--------------------------------------------------------
//-- Node IoC - Translation - Translation Service Provider
//--------------------------------------------------------

import ServiceProvider from '../foundation/ServiceProvider';
import Translator      from './services/Translator';


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
		this.bindTranslator();
	}

	/**
	 * Bind translator service.
	 */
	bindTranslator() {
		this.app.singleton('translator', Translator);
	}

}


export default TranslationServiceProvider;
