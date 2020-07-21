//--------------------------------------------------------
//-- Node IoC - Database - Connector - MySQL Driver
//--------------------------------------------------------

import Driver from './Driver';

/**
 * MySQL connector driver.
 *
 * @memberof database.services.Connector.drivers
 * @augments database.services.Connector.drivers.Driver
 * @hideconstructor
 */
class MySQLDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	get client() {
		return 'mysql';
	}

}

export default MySQLDriver;
