//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Rollback Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const MigrateRollbackCommand = require('../../../../src/database/commands/MigrateRollbackCommand');


//-- Given
//--------------------------------------------------------

given.migrateRollbackCommand = () => {
	given.command(MigrateRollbackCommand);
};


module.exports = build({ given, when, then });
