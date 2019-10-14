//--------------------------------------------------------
//-- Node IoC - Events - Services - Dispatcher - Dispatcher Proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxies/ForwardProxy');


/**
 * Dispatcher proxy handler that forwards calls to the configured driver.
 *
 * @memberof events.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class DispatcherProxy extends ForwardProxy {

}


module.exports = DispatcherProxy;
