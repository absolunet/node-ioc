"use strict";

exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - File Driver
//--------------------------------------------------------

/**
 * Driver that logs into a file.
 *
 * @memberof log.services.Logger.drivers
 * @augments log.services.Logger.drivers.Driver
 * @hideconstructor
 */
class FileDriver extends _Driver.default {
  /**
   * Class dependencies: <code>['app', 'file.engine', 'helper.file', 'log.level']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'file.engine', 'helper.file']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    this.threshold = '25mb';
    this.setConfig({
      path: this.app.storagePath(['logs', 'ioc.log']),
      level: 'debug'
    });
  }
  /**
   * @inheritdoc
   */


  async log(level, message) {
    const {
      fs,
      config: {
        path: file
      }
    } = this;
    this.ensureLimitIsUnderThreshold();
    await fs.ensureFile(file);
    await fs.appendFile(file, this.getFullMessage(level, message));
    await this.adjustFile();
    return this;
  }
  /**
   * Get full message to log.
   *
   * @param {number} level - The log level.
   * @param {string} message - The message.
   * @returns {string} The full formatted message.
   */


  getFullMessage(level, message) {
    const formattedLevel = this.getFormattedLevel(level);
    const formattedDate = this.getFormattedDate();
    const formattedVersion = this.getFormattedVersion();
    const formattedMessage = this.getFormattedMessage(`\n ${message}`);
    return `${formattedLevel} [${formattedDate}] [${formattedVersion}]${formattedMessage}\n\n`;
  }
  /**
   * Get current formatted date.
   *
   * @returns {string} The formatted date.
   */


  getFormattedDate() {
    return new Date().toISOString().replace('T', ' ').replace(/\.\d+Z/u, '');
  }
  /**
   * Get formatted level.
   *
   * @param {number} level - The level value.
   * @returns {string} The formatted level.
   */


  getFormattedLevel(level) {
    return (typeof level === 'string' ? level : this.LEVEL[level]).toLowerCase().padEnd(this.getLevelMaxLength());
  }
  /**
   * Get formatted message with proper spacers.
   *
   * @param {string} message - The message.
   * @returns {string} The formatted message.
   */


  getFormattedMessage(message) {
    return (typeof message === 'undefined' ? 'undefined' : message).toString().replace(/(?<lines>\n+)/gu, `$<lines>${this.getSpacer()}`);
  }
  /**
   * Get formatted application version.
   *
   * @returns {string} The formatted application version.
   */


  getFormattedVersion() {
    return `Version ${this.app.version}`;
  }
  /**
   * Get maximum string length of available levels.
   *
   * @returns {number} The maximum length of all level in string version.
   */


  getLevelMaxLength() {
    return Math.max(...this.LEVEL.keys().map(({
      length
    }) => {
      return length;
    }));
  }
  /**
   * Get white space based on maximum level length.
   *
   * @returns {string} A spacer that covers the longest level string.
   */


  getSpacer() {
    return ' '.repeat(this.getLevelMaxLength());
  }
  /**
   * Ensure the configured file size limit is under the driver threshold.
   * This will prevent memory leak if removing segment in a too large file.
   */


  ensureLimitIsUnderThreshold() {
    if (this.hasLimit()) {
      const {
        threshold,
        config: {
          limit
        }
      } = this;
      const sizeLimit = this.fileHelper.parseSize(limit);
      const sizeThreshold = this.fileHelper.parseSize(threshold);

      if (sizeLimit > sizeThreshold) {
        throw new TypeError(`Size limit of [${limit}] is over maximum threshold of [${threshold}]`);
      }
    }
  }
  /**
   * Adjust file content to fit under the configured size limit.
   *
   * @returns {Promise} The async process promise.
   */


  async adjustFile() {
    if (this.hasLimit()) {
      const {
        fs,
        config: {
          path: file,
          limit
        }
      } = this;
      const sizeLimit = this.fileHelper.parseSize(limit);
      const separator = '\n\n';
      let {
        size
      } = await fs.stat(file);
      /* eslint-disable no-await-in-loop */

      while (size > sizeLimit) {
        const log = await fs.readFile(file);
        await fs.writeFile(file, log.toString().split(separator).slice(1).join(separator));
        ({
          size
        } = await fs.stat(file));
      }
      /* eslint-enable no-await-in-loop */

    }
  }
  /**
   * Check if configuration has specified size limit.
   *
   * @returns {boolean} Indicates if a limit was set in the driver configuration.
   */


  hasLimit() {
    return Boolean(this.config.limit);
  }
  /**
   * The async file system.
   *
   * @type {file.system.Async}
   */


  get fs() {
    return this.fileEngine.async;
  }
  /**
   * File helper.
   *
   * @type {support.helpers.FileHelper}
   */


  get fileHelper() {
    return this.helperFile;
  }

}

var _default = FileDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;