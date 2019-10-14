//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Status Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const MigrateStatusCommand = require('../../../../src/database/commands/MigrateStatusCommand');


//-- Given
//--------------------------------------------------------

given.migrateStatusCommand = () => {
	given.command(MigrateStatusCommand);
};


module.exports = build({ given, when, then });
