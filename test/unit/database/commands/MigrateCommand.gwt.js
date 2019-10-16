//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const MigrateCommand = require('../../../../dist/node/database/commands/MigrateCommand');


//-- Given
//--------------------------------------------------------

given.migrateCommand = () => {
	given.command(MigrateCommand);
};


module.exports = build({ given, when, then });
