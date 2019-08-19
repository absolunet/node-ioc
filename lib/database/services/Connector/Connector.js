//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------
'use strict';

const hasDriver      = require('../../../support/mixins/hasDriver');
const ConnectorProxy = require('./ConnectorProxy');
const SqliteDriver   = require('./drivers/SqliteDriver');


class Connector extends hasDriver() {

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

}


module.exports = Connector;
