//--------------------------------------------------------
//-- Node IoC - Support - Helpers - String Helper proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../proxies/ForwardProxy');


/**
 * Proxy handler that forwards calls to the to-case module.
 *
 * @memberof support.helpers
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class StringHelperProxy extends ForwardProxy {

}


module.exports = StringHelperProxy;
