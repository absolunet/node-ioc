//--------------------------------------------------------
//-- Node IoC - Security - Security Service Provider
//--------------------------------------------------------
'use strict';

const Gate = require('./services/Gate');

const ServiceProvider = require('../foundation/ServiceProvider'); // eslint-disable-next-line jsdoc/require-description-complete-sentence

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


class SecurityServiceProvider extends ServiceProvider {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('gate', Gate);
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.defineBasicPolicies(this.app.make('gate'));
  }
  /**
   * Define basic policy rules.
   *
   * @param {Gate} gate - The gate service instance.
   */


  defineBasicPolicies(gate) {
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

module.exports = SecurityServiceProvider;