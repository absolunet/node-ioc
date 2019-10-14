//--------------------------------------------------------
//-- Node IoC - Console - Services - Yargs Engine
//--------------------------------------------------------
'use strict';
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

module.exports = YargsEngine;