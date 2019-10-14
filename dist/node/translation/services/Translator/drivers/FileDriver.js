//--------------------------------------------------------
//-- Node IoC - Translation - Services - Translator - Drivers - File Driver
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const deepMerge = require('deepmerge');

const dot = require('dot-object');

const Driver = require('./Driver');
/**
 * File driver to handle translations.
 *
 * @memberof translation.services.Translator.drivers
 * @augments translation.services.Translator.drivers.Driver
 * @hideconstructor
 */


class FileDriver extends Driver {
  /**
   * Class dependencies.
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
    __(this).set('locale', null);

    __(this).set('fallbackLocale', null);

    __(this).set('translations', {});

    __(this).set('loaded', false);
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
    dot.str(`${key}.${locale}`, value, __(this).get('translations'));
    return this;
  }
  /**
   * @inheritdoc
   */


  useTranslationFolder(folder) {
    __(this).set('folder', folder);

    return this;
  }
  /**
   * @inheritdoc
   */


  setLocale(locale) {
    __(this).set('locale', locale);

    return this;
  }
  /**
   * @inheritdoc
   */


  setFallbackLocale(locale) {
    __(this).set('fallbackLocale', locale);

    return this;
  }
  /**
   * Ensure that the translations are loaded from configured path.
   *
   * @returns {FileDriver} - The current driver instance.
   */


  ensureTranslationsAreLoaded() {
    if (!__(this).get('loaded')) {
      if (this.file.exists(this.folder)) {
        const translations = this.file.loadInFolder(this.folder, {
          recursive: true
        });
        this.addTranslations(translations);

        __(this).set('loaded', true);
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
    const translations = __(this).get('translations');

    const {
      fallbackLocale
    } = this;
    let translation = dot.pick(`${key}.${locale}`, translations);

    if (!translation) {
      translation = dot.pick(`${this.defaultNamespace}.${key}.${locale}`, translations);
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
    __(this).set('translations', deepMerge(__(this).get('translations'), translations));

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
    return __(this).get('locale');
  }
  /**
   * The fallback locale.
   *
   * @type {string}
   */


  get fallbackLocale() {
    return __(this).get('fallbackLocale');
  }
  /**
   * The folder in which the translations are stored.
   *
   * @type {string}
   */


  get folder() {
    return __(this).get('folder') || this.app.langPath();
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

module.exports = FileDriver;