//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator - Drivers - Driver
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
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
		throw new NotImplementedError(this, 'translate', 'string');
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
		throw new NotImplementedError(this, 'addTranslation', 'Driver');
	}

	/**
	 * Use given translation folder to load all default available translations.
	 *
	 * @param {string} folder
	 * @returns {Driver}
	 * @abstract
	 */
	useTranslationFolder() {
		throw new NotImplementedError(this, 'useTranslationFolder');
	}

	/**
	 * Set locale to use for translation.
	 *
	 * @param {string} locale
	 * @returns {Driver}
	 * @abstract
	 */
	setLocale() {
		throw new NotImplementedError(this, 'setLocale');
	}

	/**
	 * Set fallback locale.
	 *
	 * @param {string} locale
	 * @returns {Driver}
	 */
	setFallbackLocale() {
		throw new NotImplementedError(this, 'setFallbackLocale');
	}

}


module.exports = Driver;
