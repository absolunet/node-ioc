//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------
'use strict';

const forwardsCall = require('../../../support/mixins/forwardCalls');

const hasDriver = require('../../../support/mixins/hasDriver');

const ConnectorProxy = require('./ConnectorProxy');

const SqliteDriver = require('./drivers/SqliteDriver');
/**
 * Connector that decorates a Knex connection through a driver.
 *
 * @memberof database.services
 * @augments support.mixins.ForwardCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */


class Connector extends forwardsCall(hasDriver()) {
  /**
   * Connector constructor.
   *
   * @param {...*} parameters - The injected parameters.
   * @returns {Connector} - A connector instance wrapped by a forward proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new ConnectorProxy());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('sqlite', SqliteDriver);
  }
  /**
   * @inheritdoc
   */


  getForward(object) {
    return object.driver();
  }

}

module.exports = Connector;