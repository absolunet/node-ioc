//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------

import hasDriver      from '../../../support/mixins/hasDriver';
import ConnectorProxy from './ConnectorProxy';
import SqliteDriver   from './drivers/SqliteDriver';
import MySQLDriver    from './drivers/MySQLDriver';


/**
 * Connector that decorates a Knex connection through a driver.
 *
 * @memberof database.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Connector extends hasDriver() {

	/**
	 * Connector constructor.
	 *
	 * @param {...*} parameters - The injected parameters.
	 * @returns {database.services.Connector} A connector instance wrapped by a forward proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new ConnectorProxy());
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();

		this.addDriver('sqlite', SqliteDriver);
		this.addDriver('mysql',  MySQLDriver);
	}

}


export default Connector;
