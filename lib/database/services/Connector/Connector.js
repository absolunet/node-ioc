//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------
'use strict';

const forwardsCall   = require('../../../support/mixins/forwardCalls');
const hasDriver      = require('../../../support/mixins/hasDriver');
const ConnectorProxy = require('./ConnectorProxy');
const SqliteDriver   = require('./drivers/SqliteDriver');


class Connector extends forwardsCall(hasDriver()) {

	/**
	 * Connector constructor.
	 *
	 * @param {...*[]} parameters
	 * @returns {Connector}
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new ConnectorProxy());
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();

		this.addDriver('sqlite', SqliteDriver);
	}

	/**
	 * {@inheritdoc}
	 */
	getForward(object) {
		return object.driver();
	}

}


module.exports = Connector;
