//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Rollback Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import MigrateRollbackCommand from '../../../../dist/node/database/commands/MigrateRollbackCommand';


//-- Given
//--------------------------------------------------------

given.migrateRollbackCommand = () => {
	given.command(MigrateRollbackCommand);
};


export default build({ given, when, then });
