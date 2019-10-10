//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Seed Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const SeedCommand = require('../../../../lib/database/commands/SeedCommand');


//-- Given
//--------------------------------------------------------

given.seedCommand = () => {
	given.command(SeedCommand);
};


module.exports = build({ given, when, then });
