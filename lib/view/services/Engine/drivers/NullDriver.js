//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class NullDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	make() {
		return null;
	}

	/**
	 * {@inheritdoc}
	 */
	render() {
		return '';
	}

}

module.exports = NullDriver;
