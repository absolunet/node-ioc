//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Sync
//--------------------------------------------------------
'use strict';

const SyncProxy = require('./SyncProxy');

const forwardCalls = require('../../../support/mixins/forwardCalls');
/**
 * The sync file system.
 *
 * @memberof file.systems
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */


class Sync extends forwardCalls() {
  /**
   * Sync constructor.
   *
   * @param {...*} parameters - Injected parameters.
   * @returns {Sync} - The sync instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new SyncProxy());
  }
  /**
   * Replace searched content by replacement string.
   *
   * @param {string} file - File name or pattern.
   * @param {string|RegExp} search - The searched pattern.
   * @param {string} replace - The replacement value.
   * @param {object} [options] - The replace-in-file module options.
   */


  replaceInFile(file, search, replace, options = {}) {
    const flags = [...new Set([...(search.flags || '').split(''), 'g', 'u'])];
    const regex = new RegExp(search, flags.join(''));

    require('replace-in-file').sync({ // eslint-disable-line global-require
      ...options,
      files: file,
      from: regex,
      to: replace
    });
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return require('@absolunet/fss'); // eslint-disable-line global-require
  }

}

module.exports = Sync;