"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------

/**
 * Environment repository that exposes all environment variables.
 *
 * @memberof config.repositories
 * @hideconstructor
 */
class EnvironmentRepository {
  /**
   * Class dependencies: <code>['app', 'evaluator']</code>.
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
    } = _dotenv.default.config({
      path: file
    });

    const environment = Object.entries(error ? {} : parsed).reduce((object, [key, value]) => {
      object[key] = value;
      return object;
    }, process.env); // eslint-disable-line no-process-env

    (0, _privateRegistry.default)(this).set('env', environment);
  }
  /**
   * Get all loaded environment variables.
   *
   * @returns {object<string, *>} - The environment variables.
   */


  all() {
    return { ...((0, _privateRegistry.default)(this).get('env') || {})
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

var _default = EnvironmentRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;