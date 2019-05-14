//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector Proxy
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const ForwardProxy = require('../../../support/proxy/ForwardProxy');


class BuilderProxy extends ForwardProxy {

	/**
	 * {@inheritdoc}
	 */
	getForward(obj) {
		return obj.getConnection();
	}

}

module.exports = BuilderProxy;
