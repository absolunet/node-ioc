//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const ForwardProxy = require('./../../../support/proxy/ForwardProxy');


class ConnectorProxy extends ForwardProxy {

	/**
	 * {@inheritdoc}
	 */
	getForward(obj) {
		return obj.driver();
	}

}

module.exports = ConnectorProxy;
