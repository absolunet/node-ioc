//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Path Helper proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../proxies/ForwardProxy');


/**
 * Proxy handler that forwards calls to the path module.
 *
 * @memberof support.helpers
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class PathHelperProxy extends ForwardProxy {

}


module.exports = PathHelperProxy;
