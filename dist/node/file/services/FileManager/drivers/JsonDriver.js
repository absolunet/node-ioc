//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');
/**
 * JSON driver that allow .json file interpretation load. Allow to write into .json file from a JSON serialisable instance.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */


class JsonDriver extends Driver {
  /**
   * @inheritdoc
   */
  load(file) {
    return this.fileEngine.sync.readJson(file);
  }
  /**
   * @inheritdoc
   */


  loadAsync(file) {
    return this.fileEngine.async.readJson(file);
  }
  /**
   * @inheritdoc
   */


  write(file, content, options = {}) {
    try {
      this.fileEngine.sync.writeJson(file, content, options);
      return true;
    } catch (error) {
      return false;
    }
  }
  /**
   * @inheritdoc
   */


  async writeAsync(file, content, options = {}) {
    try {
      await this.fileEngine.async.writeJson(file, content, options);
      return true;
    } catch (error) {
      return false;
    }
  }

}

module.exports = JsonDriver;