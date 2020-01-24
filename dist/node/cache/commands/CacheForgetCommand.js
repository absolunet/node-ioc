"use strict";

exports.default = void 0;

var _Command = _interopRequireDefault(require("../../console/Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Cache - Command - Cache Flush
//--------------------------------------------------------

/**
 * Command that delete a specific item from the cache.
 *
 * @memberof cache.commands
 * @augments console.Command
 * @hideconstructor
 */
class CacheForgetCommand extends _Command.default {
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
    return 'cache:forget';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t('commands.cache-forget.description');
  }
  /**
   * @inheritdoc
   */


  get parameters() {
    return [['key', true, null, this.t('commands.cache-forget.parameters.key')], ['store', false, null, this.t('commands.cache-forget.parameters.store')]];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const store = this.getStore();
    const key = this.parameter('key');
    this.info(this.t('commands.cache-forget.messages.deleting'));
    await store.delete(key);
    this.info(this.t('commands.cache-forget.messages.deleted'));
  }
  /**
   * Get cache store driver instance.
   *
   * @returns {cache.services.CacheManager.drivers.Driver} The cache store driver instance.
   */


  getStore() {
    const store = this.parameter('store');
    this.spam(this.t('commands.cache-forget.messages.get-store', {
      store: store || 'default'
    }));
    return this.cache.resolve(store);
  }

}

var _default = CacheForgetCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;