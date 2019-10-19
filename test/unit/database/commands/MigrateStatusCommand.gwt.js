//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Status Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import MigrateStatusCommand from '../../../../dist/node/database/commands/MigrateStatusCommand';


//-- Given
//--------------------------------------------------------

given.migrateStatusCommand = () => {
	given.command(MigrateStatusCommand);
};


export default build({ given, when, then });
