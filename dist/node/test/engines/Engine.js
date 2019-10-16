"use strict";

exports.default = void 0;

var _NotImplementedError = _interopRequireDefault(require("../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Engines - Engine
//--------------------------------------------------------

/**
 * Abstract test engine.
 *
 * @memberof test.engines
 * @abstract
 * @hideconstructor
 */
class Engine {
  /**
   * Engine accessor.
   *
   * @type {*}
   * @abstract
   */
  get engine() {
    throw new _NotImplementedError.default(this, 'engine', 'engine', 'accessor');
  }
  /**
   * Engine CLI path accessor.
   *
   * @type {string}
   * @abstract
   */


  get path() {
    throw new _NotImplementedError.default(this, 'path', 'string', 'accessor');
  }
  /**
   * Extra argument to send to the CLI from the tested folder type.
   *
   * @param {string} [repositoryName] - The repository name.
   * @returns {string} - The path arguments.
   */


  getPathArgument(repositoryName) {
    // eslint-disable-line no-unused-vars
    return '';
  }
  /**
   * Get describe method.
   *
   * @type {Function}
   * @abstract
   */


  get describe() {
    throw new _NotImplementedError.default(this, 'describe', 'function', 'accessor');
  }
  /**
   * Get test method.
   *
   * @type {Function}
   * @abstract
   */


  get test() {
    throw new _NotImplementedError.default(this, 'test', 'function', 'accessor');
  }
  /**
   * Get beforeAll method.
   *
   * @type {Function}
   * @abstract
   */


  get beforeAll() {
    throw new _NotImplementedError.default(this, 'beforeAll', 'function', 'accessor');
  }
  /**
   * Get beforeEach method.
   *
   * @type {Function}
   * @abstract
   */


  get beforeEach() {
    throw new _NotImplementedError.default(this, 'beforeEach', 'function', 'accessor');
  }
  /**
   * Get afterEach method.
   *
   * @type {Function}
   * @abstract
   */


  get afterEach() {
    throw new _NotImplementedError.default(this, 'afterEach', 'function', 'accessor');
  }
  /**
   * Get afterAll method.
   *
   * @type {Function}
   * @abstract
   */


  get afterAll() {
    throw new _NotImplementedError.default(this, 'afterAll', 'function', 'accessor');
  }
  /**
   * Get expect method.
   *
   * @type {Function}
   * @abstract
   */


  get expect() {
    throw new _NotImplementedError.default(this, 'expect', 'function', 'accessor');
  }
  /**
   * Get assert object.
   *
   * @type {*}
   * @abstract
   */


  get assert() {
    throw new _NotImplementedError.default(this, 'asserts', 'object', 'accessor');
  }

}

var _default = Engine;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;