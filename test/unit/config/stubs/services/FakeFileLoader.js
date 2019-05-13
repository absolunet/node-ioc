//--------------------------------------------------------
//-- Tests - Unit - Config - File loader stub
//--------------------------------------------------------
'use strict';

const slash = require('slash');

const configData = require('./../config/data');


class FakeFileLoader {

	load(file) {
		const index = slash(file).split('/').pop().split('.').shift();

		return configData[index] || {};
	}

	loadFirst() {
		return configData;
	}

	scandir() {
		return Object.keys(configData);
	}

}


module.exports = FakeFileLoader;
