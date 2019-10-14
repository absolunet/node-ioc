//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');
/**
 * YAML driver that allow .yml/.yaml file interpretation load. Allow to write into .yml/yaml file from a JSON serialisable instance.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */


class YamlDriver extends Driver {
  /**
   * @inheritdoc
   */
  load(file) {
    return this.fileEngine.sync.readYaml(file);
  }
  /**
   * @inheritdoc
   */


  loadAsync(file) {
    return this.fileEngine.async.readYaml(file);
  }
  /**
   * @inheritdoc
   */


  write(file, content) {
    return this.fileEngine.sync.writeYaml(file, content);
  }
  /**
   * @inheritdoc
   */


  writeAsync(file, content) {
    return this.fileEngine.async.writeYaml(file, content);
  }

}

module.exports = YamlDriver;