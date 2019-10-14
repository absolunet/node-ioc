//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher
//--------------------------------------------------------
'use strict';

const hasDriver = require('../../../support/mixins/hasDriver');

const forwardCalls = require('../../../support/mixins/forwardCalls');

const DispatcherProxy = require('./DispatcherProxy');

const EventEmitterDriver = require('./drivers/EventEmitterDriver');

const PubSubJsDriver = require('./drivers/PubSubJsDriver');
/**
 * Event dispatcher that manages the events publishing and subscribing.
 *
 * @memberof events.services
 * @augments support.mixins.ForwardCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */


class Dispatcher extends forwardCalls(hasDriver()) {
  /**
   * Dispatcher constructor.
   *
   * @param {...*} parameters - Injected parameters.
   * @returns {Dispatcher} - The dispatcher instance wrapped by a proxy.
   */
  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new DispatcherProxy());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('emitter', EventEmitterDriver);
    this.addDriver('pubsubjs', PubSubJsDriver);
    const {
      app
    } = this;
    const defaultDriver = app.isBound('config') ? app.make('config').get('events.default', 'emitter') : 'emitter';
    this.setDefaultDriver(defaultDriver);
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return this.driver();
  }

}

module.exports = Dispatcher;