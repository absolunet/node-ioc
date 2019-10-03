//--------------------------------------------------------
//-- Node IoC - Console - Services - Yargs Engine
//--------------------------------------------------------
'use strict';


class YargsEngine {

	constructor() {
		return require('yargs'); // eslint-disable-line global-require
	}

}


module.exports = YargsEngine;
