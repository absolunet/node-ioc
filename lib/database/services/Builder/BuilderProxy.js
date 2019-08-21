//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------
'use strict';


const ForwardProxy = require('../../../support/proxy/ForwardProxy');


class BuilderProxy extends ForwardProxy {

	/**
	 * {@inheritdoc}
	 */
	getForward(object) {
		return object.getDefaultConnection();
	}

}

module.exports = BuilderProxy;
