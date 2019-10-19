//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Migrate Fresh Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import MigrateFreshCommand from '../../../../dist/node/database/commands/MigrateFreshCommand';


//-- Given
//--------------------------------------------------------

given.migrateFreshCommand = () => {
	given.command(MigrateFreshCommand);
};


export default build({ given, when, then });
