//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator
//--------------------------------------------------------

import hasDriver  from '../../../support/mixins/hasDriver';
import FileDriver from './drivers/FileDriver';


/**
 * Translator that implements i18n basic features.
 *
 * @memberof translation.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Translator extends hasDriver() {

	/**
	 * Class dependencies: <code>['app', 'config']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();
		this.addDriver('file', FileDriver);
		this.setDefaultDriver('file');
	}

	/**
	 * @inheritdoc
	 */
	bootDriver(driver) {
		driver.setLocale(this.locale);
		driver.setFallbackLocale(this.fallbackLocale);

		return super.bootDriver(driver);
	}

	/**
	 * Load translations from source.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async loadTranslations() {
		await this.driver().loadTranslations();
	}

	/**
	 * Translate a string for the current locale.
	 * If replacement object is given, replace placeholders by the given replacement.
	 *
	 * @param {string} string - The string to translate.
	 * @param {object<string, string>} [replacements] - The token replacements.
	 * @param {number} [count] - The string count for pluralization.
	 * @returns {string} The translated string.
	 */
	translate(string, replacements = {}, count = 1) {
		return this.driver().translate(string, replacements, count);
	}

	/**
	 * Translate a string for the given locale.
	 *
	 * @param {string} locale - The locale to use for translation.
	 * @param {string} string - The string to translate.
	 * @param {object<string, string>} [replacements] - The token replacements.
	 * @param {number} [count] - The string count for pluralization.
	 * @returns {string} The translated string.
	 */
	translateForLocale(locale, string, replacements, count) {
		const { locale: originalLocale } = this;
		this.setLocale(locale);
		const translation = this.translate(string, replacements, count);
		this.setLocale(originalLocale);

		return translation;
	}

	/**
	 * Add translation key and value for given locale or current locale.
	 *
	 * @param {string} key - The translation key.
	 * @param {string} value - The translation value.
	 * @param {string|null} locale - The locale the translation should be used for.
	 * @returns {translation.services.Translator} The current translator instance.
	 */
	addTranslation(key, value, locale = null) {
		this.driver().addTranslation(key, value, locale || this.locale);

		return this;
	}

	/**
	 * Add translations from key-value pair object.
	 *
	 * @example
	 * translator.addTranslations({
	 *     foo: {
	 *         bar: {
	 *             en: 'baz',
	 *             fr: 'qux'
	 *         }
	 *     }
	 * });
	 *
	 * @param {object<string, object<string, object|string>>} translations - Collection of translations.
	 * @returns {translation.services.Translator} The current translator instance.
	 */
	addTranslations(translations) {
		this.driver().addTranslations(translations);

		return this;
	}

	/**
	 * Set locale to use for translation.
	 *
	 * @param {string} locale - The locale.
	 * @returns {translation.services.Translator} The current translator instance.
	 */
	setLocale(locale) {
		this.config.set('app.locale', locale);
		this.driver().setLocale(locale);

		return this;
	}

	/**
	 * Set fallback locale to use if translation in default locale does not exists.
	 *
	 * @param {string} locale - The fallback locale.
	 * @returns {translation.services.Translator} The current translator instance.
	 */
	setFallbackLocale(locale) {
		this.config.set('app.fallback_locale', locale);
		this.driver().setFallbackLocale(locale);

		return this;
	}

	/**
	 * Current locale.
	 *
	 * @type {string}
	 */
	get locale() {
		return this.config.get('app.locale', 'en');
	}

	/**
	 * Current fallback locale.
	 *
	 * @type {string}
	 */
	get fallbackLocale() {
		return this.config.get('app.fallback_locale', 'en');
	}

}


export default Translator;
