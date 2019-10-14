//--------------------------------------------------------
//-- Tests - Unit - Container
//--------------------------------------------------------
'use strict';

const { Application } = require('../../src');

const container = Application.make();


beforeEach(() => {
	container.flush();
});


module.exports = container;
