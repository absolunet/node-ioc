"use strict";

exports.default = void 0;

var _Engine = _interopRequireDefault(require("./Engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Engines - Jest
//--------------------------------------------------------

/**
 * Jest engine.
 *
 * @memberof test.engines
 * @augments test.engines.Engine
 * @hideconstructor
 */
class JestEngine extends _Engine.default {
  /**
   * @inheritdoc
   */
  get engine() {
    return global.jest;
  }
  /**
   * @inheritdoc
   */


  get path() {
    return 'node_modules/jest/bin/jest';
  }
  /**
   * @inheritdoc
   */


  get describe() {
    return global.describe;
  }
  /**
   * @inheritdoc
   */


  get test() {
    return global.test;
  }
  /**
   * @inheritdoc
   */


  get beforeAll() {
    return global.beforeAll;
  }
  /**
   * @inheritdoc
   */


  get beforeEach() {
    return global.beforeEach;
  }
  /**
   * @inheritdoc
   */


  get afterEach() {
    return global.afterEach;
  }
  /**
   * @inheritdoc
   */


  get afterAll() {
    return global.afterAll;
  }
  /**
   * @inheritdoc
   */


  get expect() {
    return global.expect;
  }
  /**
   * @inheritdoc
   */


  get assert() {
    return global.assert;
  }

}

var _default = JestEngine;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;