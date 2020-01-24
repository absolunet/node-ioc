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
    return ['cache'];
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
    return this.t('commands.cache-clear.description');
  }
  /**
   * @inheritdoc
   */


  get parameters() {
    return [['store', false, null, this.t('commands.cache-clear.parameters.store')]];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const store = this.getStore();
    this.info(this.t('commands.cache-clear.messages.flushing'));
    await store.flush();
    this.info(this.t('commands.cache-clear.messages.flushed'));
  }
  /**
   * Get cache store driver instance.
   *
   * @returns {cache.services.CacheManager.drivers.Driver} The cache store driver instance.
   */


  getStore() {
    const store = this.parameter('store');
    this.spam(this.t('commands.cache-clear.messages.get-store', {
      store: store || 'default'
    }));
    return this.cache.resolve(store);
  }

}

var _default = CacheClearCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;