"use strict";

exports.default = void 0;

var _NotImplementedError = _interopRequireDefault(require("../../../../foundation/exceptions/NotImplementedError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Config - Driver
//--------------------------------------------------------

/* istanbul ignore next */

/**
 * Abstract driver that defines the basic interface for a file manager driver.
 *
 * @memberof file.services.FileManager.drivers
 * @abstract
 * @hideconstructor
 */
class Driver {
  /**
   * Class dependencies: <code>['file.engine']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['file.engine'];
  }
  /**
   * Load the given file.
   *
   * @param {string} file - The file path.
   * @returns {*} The file content.
   * @abstract
   */


  load(file) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'load', 'any');
  }
  /**
   * Asynchronously load the given file.
   *
   * @param {string} file - The file path.
   * @returns {Promise<*>} The file content.
   * @abstract
   */


  loadAsync(file) {
    // eslint-disable-line no-unused-vars
    throw new _NotImplementedError.default(this, 'loadAsync', 'Promise<any>');
  }
  /**
   * Write file in the given destination.
   *
   * @param {string} file - The file path.
   * @param {string|Stream} content - The content to put in the file.
   * @param {*} [options] - The options to send to the write process.
   * @returns {boolean} Indicates that the process was successful.
   */


  write(file, content, options = {}) {
    try {
      this.fileEngine.sync.writeFile(file, content, options);
      return true;
    } catch (error) {
      return false;
    }
  }
  /**
   * Asynchronously write file in the given directory.
   *
   * @param {string} file - The file path.
   * @param {string|Stream} content - The content to put in the file.
   * @param {*} [options] - The options to send to the write process.
   * @returns {Promise<boolean>} Indicates that the process was successful.
   */


  writeAsync(file, content, options = {}) {
    return this.fileEngine.async.writeFile(file, content, options);
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;