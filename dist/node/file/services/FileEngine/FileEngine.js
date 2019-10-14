//--------------------------------------------------------
//-- Node IoC - File - Engine
//--------------------------------------------------------
'use strict';

const FileEngineProxy = require('./FileEngineProxy');

const forwardCalls = require('../../../support/mixins/forwardCalls');
/**
 * File engine that allows simple operation inside the native Node.js file system.
 *
 * Any calls that are not listed are forwarded to the sync file system.
 *
 * @memberof file.services
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */


class FileEngine extends forwardCalls() {
  /**
   * Class dependencies.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'file.system.async', 'file.system.sync']);
  }
  /**
   * FileEngine constructor.
   *
   * @param {...*} parameters - Injected parameters.
   * @returns {FileEngine} - The file engine instance wrapped by a proxy.
   */


  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new FileEngineProxy());
  }
  /**
   * Async file system.
   *
   * @type {Async}
   */


  get async() {
    return this.fileSystemAsync;
  }
  /**
   * Sync file system.
   *
   * @type {Sync}
   */


  get sync() {
    return this.fileSystemSync;
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return this.sync;
  }

}

module.exports = FileEngine;