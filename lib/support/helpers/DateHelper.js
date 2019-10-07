//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------
'use strict';

const moment = require('moment');

class DateHelper {

	/**
	 * DateHelper constructor.
	 *
	 * @returns {moment}
	 */
	constructor() {
		return moment;
	}

}


module.exports = DateHelper;
