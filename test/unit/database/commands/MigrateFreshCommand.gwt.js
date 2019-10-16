//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Fresh Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const MigrateFreshCommand = require('../../../../dist/node/database/commands/MigrateFreshCommand');


//-- Given
//--------------------------------------------------------

given.migrateFreshCommand = () => {
	given.command(MigrateFreshCommand);
};


module.exports = build({ given, when, then });
