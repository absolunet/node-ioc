//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxies/ForwardProxy');
/**
 * Connector proxy handler that forwards calls to the underlying driver.
 *
 * @memberof database.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */


class ConnectorProxy extends ForwardProxy {}

module.exports = ConnectorProxy;