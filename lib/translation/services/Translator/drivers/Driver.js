//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator - Drivers - Driver
//--------------------------------------------------------
'use strict';


class Driver {

	/**
	 * Translate a string for the current locale.
	 * If replacement array is given, replace %s by the given replacement in order of appearance.
	 *
	 * @param {string} string
	 * @param {Object<string, string>} replacements
	 * @param {number} [count]
	 * @returns {string}
	 * @abstract
	 */
	translate() {
		throw new TypeError('Method translate() must be implemented. It must return a string.');
	}

	/**
	 * Add translation key and value for given locale or current locale.
	 *
	 * @param {string} key
	 * @param {string} value
	 * @param {string|null} locale
	 * @returns {Driver}
	 */
	addTranslation() {
		throw new TypeError('Method addTranslation() must be implemented.');
	}

	/**
	 * Use given translation folder to load all default available translations.
	 *
	 * @param {string} folder
	 * @returns {Driver}
	 * @abstract
	 */
	useTranslationFolder() {
		throw new TypeError('Method useTranslationFolder() must be implemented.');
	}

	/**
	 * Set locale to use for translation.
	 *
	 * @param {string} locale
	 * @returns {Driver}
	 * @abstract
	 */
	setLocale() {
		throw new TypeError('Method setLocale() must be implemented.');
	}

	/**
	 * Set fallback locale.
	 *
	 * @param {string} locale
	 * @returns {Driver}
	 */
	setFallbackLocale() {
		throw new TypeError('Method setFallbackLocale() must be implemented.');
	}

}


module.exports = Driver;
