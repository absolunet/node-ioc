//--------------------------------------------------------
//-- Node IoC - Cache - Repositories - Cache repository proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxies/ForwardProxy');
/**
 * The Cache manager proxy handler.
 *
 * @memberof cache.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */


class CacheManagerProxy extends ForwardProxy {}

module.exports = CacheManagerProxy;