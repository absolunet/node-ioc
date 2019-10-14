//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


/**
 * Null view engine driver.
 * It always renders empty templates and never throws.
 *
 * @memberof view.services.Engine.drivers
 * @hideconstructor
 */
class NullDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	make() {
		return null;
	}

	/**
	 * @inheritdoc
	 */
	render() {
		return '';
	}

}

module.exports = NullDriver;
