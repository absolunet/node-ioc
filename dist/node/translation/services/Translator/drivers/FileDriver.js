"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _dotObject = _interopRequireDefault(require("dot-object"));

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator - Drivers - File Driver
//--------------------------------------------------------

/**
 * File driver to handle translations.
 *
 * @memberof translation.services.Translator.drivers
 * @augments translation.services.Translator.drivers.Driver
 * @hideconstructor
 */
class FileDriver extends _Driver.default {
  /**
   * Class dependencies: <code>['app', 'file']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'file']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(this).set('locale', null);
    (0, _privateRegistry.default)(this).set('fallbackLocale', null);
    (0, _privateRegistry.default)(this).set('translations', {});
    (0, _privateRegistry.default)(this).set('loaded', false);
  }
  /**
   * @inheritdoc
   */


  translate(string, replacements = {}, count = 1) {
    const {
      locale
    } = this;
    this.ensureTranslationsAreLoaded(locale);
    const replacementObject = typeof replacements === 'object' && replacements ? replacements : {};
    const countValue = typeof replacements === 'number' ? replacements : count;
    return this.parse(this.getTranslationForLocale(string, locale), replacementObject, countValue);
  }
  /**
   * @inheritdoc
   */


  addTranslation(key, value, locale = this.locale) {
    _dotObject.default.str(`${key}.${locale}`, value, (0, _privateRegistry.default)(this).get('translations'));

    return this;
  }
  /**
   * @inheritdoc
   */


  useTranslationFolder(folder) {
    (0, _privateRegistry.default)(this).set('folder', folder);
    return this;
  }
  /**
   * @inheritdoc
   */


  setLocale(locale) {
    (0, _privateRegistry.default)(this).set('locale', locale);
    return this;
  }
  /**
   * @inheritdoc
   */


  setFallbackLocale(locale) {
    (0, _privateRegistry.default)(this).set('fallbackLocale', locale);
    return this;
  }
  /**
   * Ensure that the translations are loaded from configured path.
   *
   * @returns {FileDriver} - The current driver instance.
   */


  ensureTranslationsAreLoaded() {
    if (!(0, _privateRegistry.default)(this).get('loaded')) {
      if (this.file.exists(this.folder)) {
        const translations = this.file.loadInFolder(this.folder, {
          recursive: true
        });
        this.addTranslations(translations);
        (0, _privateRegistry.default)(this).set('loaded', true);
      }
    }

    return this;
  }
  /**
   * Get unparsed translation value(s) for given locale.
   * It will use fallback locale if needed.
   *
   * @param {string} key - The translation key.
   * @param {string} locale - The locale.
   * @returns {string} - The translated value.
   */


  getTranslationForLocale(key, locale) {
    const translations = (0, _privateRegistry.default)(this).get('translations');
    const {
      fallbackLocale
    } = this;

    let translation = _dotObject.default.pick(`${key}.${locale}`, translations);

    if (!translation) {
      translation = _dotObject.default.pick(`${this.defaultNamespace}.${key}.${locale}`, translations);
    }

    if (!translation && locale !== fallbackLocale) {
      return this.getTranslationForLocale(key, fallbackLocale);
    }

    return translation || key;
  }
  /**
   * Add multiple translations.
   *
   * @param {object<string, string|object>} translations - The translation collection.
   * @returns {FileDriver} - The current driver instance.
   */


  addTranslations(translations) {
    (0, _privateRegistry.default)(this).set('translations', (0, _deepmerge.default)((0, _privateRegistry.default)(this).get('translations'), translations));
    return this;
  }
  /**
   * Parse given string with the given token replacements.
   * Handle manual pluralization based on a given count.
   *
   * @param {string|Array<string>} string - The value.
   * @param {object<string, string>} [replacements] - The token replacement dictionary.
   * @param {number} [count] - The count for pluralization.
   * @returns {string} - The parsed string.
   */


  parse(string, replacements = {}, count = 1) {
    const values = Array.isArray(string) ? string : [string];
    const [noneValue] = values;
    const singleValue = values[values.length === 3 ? 1 : 0];
    const pluralValue = values[values.length - 1];
    const value = count === 0 ? noneValue : count === 1 ? singleValue : pluralValue; // eslint-disable-line unicorn/no-nested-ternary

    return Object.keys(replacements).reduce((parsed, token) => {
      return parsed.replace(new RegExp(this.buildReplacementPattern(token), 'gu'), replacements[token]);
    }, value);
  }
  /**
   * Build the replacement pattern from a given token name.
   *
   * @param {string} token - The token to replace.
   * @returns {string} - The token pattern.
   */


  buildReplacementPattern(token) {
    return `\\{\\{${token}\\}\\}`;
  }
  /**
   * The locale.
   *
   * @type {string}
   */


  get locale() {
    return (0, _privateRegistry.default)(this).get('locale');
  }
  /**
   * The fallback locale.
   *
   * @type {string}
   */


  get fallbackLocale() {
    return (0, _privateRegistry.default)(this).get('fallbackLocale');
  }
  /**
   * The folder in which the translations are stored.
   *
   * @type {string}
   */


  get folder() {
    return (0, _privateRegistry.default)(this).get('folder') || this.app.langPath();
  }
  /**
   * The default namespace for translations.
   *
   * @type {string}
   */


  get defaultNamespace() {
    return 'translations';
  }

}

var _default = FileDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;