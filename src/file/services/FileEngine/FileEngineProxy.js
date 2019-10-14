//--------------------------------------------------------
//-- Node IoC - File - Engine Proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxies/ForwardProxy');


/**
 * File engine proxy handler that forwards calls to the sync file system.
 *
 * @memberof file.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */
class FileEngineProxy extends ForwardProxy {

}


module.exports = FileEngineProxy;
