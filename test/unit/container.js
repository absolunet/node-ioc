//--------------------------------------------------------
//-- Tests - Unit - Container
//--------------------------------------------------------
'use strict';

const { Application } = require('../../dist/node');

const container = Application.make();


beforeEach(() => {
	container.flush();
});


module.exports = container;
