//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import MigrateCommand from '../../../../dist/node/database/commands/MigrateCommand';


//-- Given
//--------------------------------------------------------

given.migrateCommand = () => {
	given.command(MigrateCommand);
};


export default build({ given, when, then });
