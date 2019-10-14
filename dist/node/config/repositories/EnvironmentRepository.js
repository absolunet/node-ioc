//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const dotenv = require('dotenv');
/**
 * Environment repository that exposes all environment variables.
 *
 * @memberof config.repositories
 * @hideconstructor
 */


class EnvironmentRepository {
  /**
   * Class dependencies.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'evaluator'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    this.setFromFile(this.app.basePath('.env'));
  }
  /**
   * Set environment values from given file.
   *
   * @param {string} file - The .env file to load the specific environment variable from.
   */


  setFromFile(file) {
    const {
      error,
      parsed
    } = dotenv.config({
      path: file
    });
    const environment = Object.entries(error ? {} : parsed).reduce((object, [key, value]) => {
      object[key] = value;
      return object;
    }, process.env);

    __(this).set('env', environment);
  }
  /**
   * Get all loaded environment variables.
   *
   * @returns {object<string, *>} - The environment variables.
   */


  all() {
    return { ...(__(this).get('env') || {})
    };
  }
  /**
   * Get single environment variable.
   * Value will be automatically cast as null, a boolean, a number or a string.
   * The first valid value will be returned.
   *
   * @param {string} key - The environment variable name.
   * @param {null|boolean|number|string}[defaultValue] - The default value to use if the environment variable is not defined.
   * @returns {boolean|null|number|string} - The environment variable value.
   */


  get(key, defaultValue = null) {
    if (!this.has(key)) {
      return defaultValue;
    }

    return this.evaluator.evaluate(this.all()[key]);
  }
  /**
   * Check if environment variable was defined.
   *
   * @param {string} key - The environment variable name.
   * @returns {boolean} - Indicates if the variable exists in environment.
   */


  has(key) {
    return Object.prototype.hasOwnProperty.call(this.all(), key);
  }

}

module.exports = EnvironmentRepository;