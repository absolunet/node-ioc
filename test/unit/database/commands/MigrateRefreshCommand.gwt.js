//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Refresh Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const MigrateRefreshCommand = require('../../../../src/database/commands/MigrateRefreshCommand');


//-- Given
//--------------------------------------------------------

given.migrateRefreshCommand = () => {
	given.command(MigrateRefreshCommand);
};


module.exports = build({ given, when, then });
