//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Seed Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import SeedCommand from '../../../../dist/node/database/commands/SeedCommand';


//-- Given
//--------------------------------------------------------

given.seedCommand = () => {
	given.command(SeedCommand);
};


export default build({ given, when, then });
