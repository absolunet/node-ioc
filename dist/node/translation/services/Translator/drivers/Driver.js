"use strict";

exports.default = void 0;

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator - Drivers - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract driver that defines the basic interface for a translator driver.
 *
 * @memberof translation.services.Translator.drivers
 * @abstract
 * @hideconstructor
 */
class Driver {
  /**
   * Load translations from source.
   *
   * @returns {Promise|void} The possible async process promise.
   * @async
   * @abstract
   */
  loadTranslations() {
    throw new _NotImplementedError.default(this, 'loadTranslations', 'Promise|void');
  }
  /**
   * Translate a string for the current locale.
   * If replacement array is given, replace %s by the given replacement in order of appearance.
   *
   * @param {string} string - The string to translate.
   * @param {object<string, string>} [replacements] - The token replacements.
   * @param {number} [count] - The string count for pluralization.
   * @returns {string} The translated string.
   * @abstract
   */


  translate(string, replacements, count) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'translate', 'string');
  }
  /**
   * Add translation key and value for given locale or current locale.
   *
   * @param {string} key - The translation key.
   * @param {string} value - The translation value.
   * @param {string|null} locale - The locale the translation should be used for.
   * @returns {translation.services.Translator.drivers.Driver} The current driver instance.
   * @abstract
   */


  addTranslation(key, value, locale) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'addTranslation', 'Driver');
  }
  /**
   * Add translations from key-value pair object.
   *
   * @example
   * driver.addTranslations({
   *     foo: {
   *         bar: {
   *             en: 'baz',
   *             fr: 'qux'
   *         }
   *     }
   * });
   *
   * @param {string} translations - The translations.
   * @returns {translation.services.Translator.drivers.Driver} The current driver instance.
   * @abstract
   */


  addTranslations(translations) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'addTranslations', 'Driver');
  }
  /**
   * Set locale to use for translation.
   *
   * @param {string} locale - The locale.
   * @returns {translation.services.Translator.drivers.Driver} The current driver instance.
   * @abstract
   */


  setLocale(locale) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'setLocale');
  }
  /**
   * Set fallback locale.
   *
   * @param {string} locale - The fallback locale.
   * @returns {translation.services.Translator.drivers.Driver} The current driver instance.
   * @abstract
   */


  setFallbackLocale(locale) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'setFallbackLocale');
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;