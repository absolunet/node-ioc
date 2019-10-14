//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker
//--------------------------------------------------------
'use strict';

const FakerProxy = require('./FakerProxy');

const forwardCalls = require('../../mixins/forwardCalls');
/**
 * Faker class that decorates the faker module.
 *
 * @memberof support.services
 * @augments support.mixins.ForwardCalls
 * @hideconstructor
 */


class Faker extends forwardCalls() {
  /**
   * Faker constructor.
   *
   * @param {...*} parameters - The injected parameters.
   * @returns {Faker} - Thee faker instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new FakerProxy());
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return require('faker'); // eslint-disable-line global-require
  }

}

module.exports = Faker;