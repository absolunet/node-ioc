//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Refresh Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import MigrateRefreshCommand from '../../../../dist/node/database/commands/MigrateRefreshCommand';


//-- Given
//--------------------------------------------------------

given.migrateRefreshCommand = () => {
	given.command(MigrateRefreshCommand);
};


export default build({ given, when, then });
