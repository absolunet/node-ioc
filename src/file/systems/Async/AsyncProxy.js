//--------------------------------------------------------
//-- Node IoC - File - Engine - System - Async proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxies/ForwardProxy');


/**
 * The Async system proxy handler that forward calls to @absolunet/fsp module.
 *
 * @memberof file.systems
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class AsyncProxy extends ForwardProxy {

}


module.exports = AsyncProxy;
