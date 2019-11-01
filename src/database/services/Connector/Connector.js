//--------------------------------------------------------
//-- Node IoC - Database - Services - Connector
//--------------------------------------------------------

import forwardsCalls  from '../../../support/mixins/forwardsCalls';
import hasDriver      from '../../../support/mixins/hasDriver';
import ConnectorProxy from './ConnectorProxy';
import SqliteDriver   from './drivers/SqliteDriver';


/**
 * Connector that decorates a Knex connection through a driver.
 *
 * @memberof database.services
 * @augments support.mixins.ForwardsCalls
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Connector extends forwardsCalls(hasDriver()) {

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
	}

	/**
	 * @inheritdoc
	 */
	getForward(object) {
		return object.driver();
	}

}


export default Connector;
