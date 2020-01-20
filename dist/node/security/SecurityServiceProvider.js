"use strict";

exports.default = void 0;

var _Gate = _interopRequireDefault(require("./services/Gate"));

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _MakePolicyCommand = _interopRequireDefault(require("./commands/MakePolicyCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Security - Security Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The security service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="security.services.Gate.html">gate</a></li>
 * </ul>
 *
 * @memberof security
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class SecurityServiceProvider extends _ServiceProvider.default {
  /**
   * @inheritdoc
   */
  get name() {
    return 'Node IoC - Security';
  }
  /**
   * Register the service provider.
   */


  register() {
    this.bindGateService();
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.defineBasicPolicies();
    this.loadCommands([_MakePolicyCommand.default]);
  }
  /**
   * Bind gate service.
   */


  bindGateService() {
    this.app.singleton('gate', _Gate.default);
  }
  /**
   * Define basic policy rules.
   */


  defineBasicPolicies() {
    const gate = this.app.make('gate');
    gate.policy('public', () => {
      return true;
    });
    gate.policy('private', () => {
      return false;
    });
    gate.policy('env', environment => {
      return this.app.environment === environment;
    });
  }

}

var _default = SecurityServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;