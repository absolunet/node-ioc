//--------------------------------------------------------
//-- Tests - Unit - Config - File loader stub
//--------------------------------------------------------
'use strict';


const configData = require('./../config/data');


class FakeFileLoader {

	loadFirst() {
		return configData;
	}

}

module.exports = FakeFileLoader;
