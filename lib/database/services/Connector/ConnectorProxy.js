//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../../support/proxy/ForwardProxy');


class ConnectorProxy extends ForwardProxy {

	/**
	 * {@inheritdoc}
	 */
	getForward(object) {
		return object.driver();
	}

}


module.exports = ConnectorProxy;
