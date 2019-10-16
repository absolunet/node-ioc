"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Console - Services - Yargs Engine
//--------------------------------------------------------

/**
 * Yargs engine.
 *
 * @memberof console.services
 * @hideconstructor
 */
class YargsEngine {
  /**
   * YargsEngine constructor.
   *
   * @returns {yargs} - Yargs module.
   */
  constructor() {
    return require('yargs'); // eslint-disable-line global-require
  }

}

var _default = YargsEngine;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;