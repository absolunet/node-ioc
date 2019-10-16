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
		driver.useTranslationFolder(this.app.langPath());

		return super.bootDriver(driver);
	}

	/**
	 * Translate a string for the current locale.
	 * If replacement object is given, replace placeholders by the given replacement.
	 *
	 * @param {string} string - The string to translate.
	 * @param {object<string, string>} [replacements] - The token replacements.
	 * @param {number} [count] - The string count for pluralization.
	 * @returns {string} - The translated string.
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
	 * @returns {string} - The translated string.
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
	 * @returns {Translator} - The current translator instance.
	 */
	addTranslation(key, value, locale = null) {
		this.driver().addTranslation(key, value, locale || this.locale);

		return this;
	}

	/**
	 * Add translations from key-value pair object for given locale or current locale.
	 *
	 * @param {object<string, string>} translations - Collection of translations.
	 * @param {string|null} [locale] - The locale the translation should be used for.
	 * @returns {Translator} - The current translator instance.
	 */
	addTranslations(translations, locale = null) {
		Object.entries(translations).forEach(([key, value]) => {
			this.addTranslation(key, value, locale);
		});

		return this;
	}

	/**
	 * Use given translation folder to load all default available translations.
	 *
	 * @param {string} folder - The folder in which translation files should be loaded.
	 * @returns {Translator} - The current translator instance.
	 */
	useTranslationFolder(folder) {
		this.driver().useTranslationFolder(folder);

		return this;
	}

	/**
	 * Set locale to use for translation.
	 *
	 * @param {string} locale - The locale.
	 * @returns {Translator} - The current translator instance.
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
	 * @returns {Translator} - The current translator instance.
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
