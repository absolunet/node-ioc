//--------------------------------------------------------
//-- Tests - Unit - Config - File loader stub
//--------------------------------------------------------
'use strict';

const slash = require('slash');

const appData  = require('../config/app');
const miscData = require('../config/misc');

const configData = {
	app: appData,
	misc: miscData
};


class FakeFileLoader {

	load(file) {
		const index = slash(file).split('/').pop().split('.').shift();

		return configData[index] || {};
	}

	scandir() {
		return Object.keys(configData);
	}

}


module.exports = FakeFileLoader;
