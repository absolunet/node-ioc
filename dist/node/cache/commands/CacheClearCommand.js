"use strict";

exports.default = void 0;

var _Command = _interopRequireDefault(require("../../console/Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Cache - Command - Cache Clear
//--------------------------------------------------------

/**
 * Command that flushes the whole cache.
 *
 * @memberof cache.commands
 * @augments console.Command
 * @hideconstructor
 */
class CacheClearCommand extends _Command.default {
  /**
   * Class dependencies: <code>['cache']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['cache']);
  }
  /**
   * @inheritdoc
   */


  get policies() {
    return ['public'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'cache:clear';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Flush the application cache.';
  }
  /**
   * @inheritdoc
   */


  get parameters() {
    return [['store', null, false, 'The name of the store you would like to clear.']];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const store = this.getStore();
    this.info('Flushing cache');
    await store.flush();
    this.info('Cache flushed');
  }
  /**
   * Get cache store driver instance.
   *
   * @returns {cache.services.CacheManager.drivers.Driver} The cache store driver instance.
   */


  getStore() {
    const name = this.parameter('store');
    this.spam(`Getting ${name ? `[${name}]` : 'default'} store instance`);
    return this.cache.resolve(name);
  }

}

var _default = CacheClearCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;