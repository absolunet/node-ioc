//--------------------------------------------------------
//-- Node IoC - Database - Model - Model Proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../support/proxy/ForwardProxy');


class ModelProxy extends ForwardProxy {

	get(factory, property) {
		return super.get(factory(), property);
	}

	construct(factory, parameters) {
		const Model = factory().getForward();

		return new Model(...parameters);
	}

}


module.exports = ModelProxy;
