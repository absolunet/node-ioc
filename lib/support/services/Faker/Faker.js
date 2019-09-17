//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker
//--------------------------------------------------------
'use strict';

const FakerProxy   = require('./FakerProxy');
const forwardCalls = require('../../mixins/forwardCalls');

class Faker extends forwardCalls() {

	/**
	 * Faker constructor.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new FakerProxy());
	}

	/**
	 * {@inheritdoc}
	 */
	getForward() {
		return require('faker'); // eslint-disable-line global-require
	}

}


module.exports = Faker;
