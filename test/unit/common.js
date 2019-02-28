//--------------------------------------------------------
//-- Tests - Unit - Common
//--------------------------------------------------------
'use strict';

const container = require('../../src');

const loadFreshContainer = () => {
	container.flush();
};

module.exports = {
	container,
	loadFreshContainer
};
