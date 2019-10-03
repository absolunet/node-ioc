//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator
//--------------------------------------------------------
'use strict';

const hasDriver  = require('../../../support/mixins/hasDriver');
const FileDriver = require('./drivers/FileDriver');


class Translator extends hasDriver() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();
		this.addDriver('file', FileDriver);
		this.setDefaultDriver('file');
	}

	/**
	 * {@inheritdoc}
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
	 * @param {string} string
	 * @param {Object<string, string>} [replacements]
	 * @param {number} [count]
	 * @returns {string}
	 */
	translate(string, replacements = {}, count = 1) {
		return this.driver().translate(string, replacements, count);
	}

	/**
	 * Translate a string for the given locale.
	 *
	 * @param {string} locale
	 * @param {string} string
	 * @param {Object<string, string>} [replacements]
	 * @param {number} [count]
	 * @returns {string}
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
	 * @param {string} key
	 * @param {string} value
	 * @param {string|null} locale
	 * @returns {Translator}
	 */
	addTranslation(key, value, locale = null) {
		this.driver().addTranslation(key, value, locale || this.locale);

		return this;
	}

	/**
	 * Add translations from key-value pair object for given locale or current locale.
	 *
	 * @param {Object<string, string>}translations
	 * @param {string|null} [locale]
	 * @returns {Translator}
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
	 * @param {string} folder
	 * @returns {Translator}
	 */
	useTranslationFolder(folder) {
		this.driver().useTranslationFolder(folder);

		return this;
	}

	/**
	 * Set locale to use for translation.
	 *
	 * @param {string} locale
	 * @returns {Translator}
	 */
	setLocale(locale) {
		this.config.set('app.locale', locale);
		this.driver().setLocale(locale);

		return this;
	}

	/**
	 * Set fallback locale to use if translation in default locale does not exists.
	 *
	 * @param {string} locale
	 * @returns {Translator}
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
	 * @type {string}
	 */
	get fallbackLocale() {
		return this.config.get('app.fallback_locale', 'en');
	}

}


module.exports = Translator;
