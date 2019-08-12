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
		return object.getConnection();
	}

}

module.exports = BuilderProxy;
