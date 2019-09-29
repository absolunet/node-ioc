//--------------------------------------------------------
//-- Tests - Unit - Container
//--------------------------------------------------------
'use strict';

const { Application } = require('../../lib');

const container = Application.make();


beforeEach(() => {
	container.flush();
});


module.exports = container;
