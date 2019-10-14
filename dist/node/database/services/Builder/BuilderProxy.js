//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxies/ForwardProxy');
/**
 * The connection builder handler forward proxy.
 *
 * @memberof database.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */


class BuilderProxy extends ForwardProxy {}

module.exports = BuilderProxy;