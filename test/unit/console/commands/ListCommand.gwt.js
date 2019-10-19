//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - List Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container   from '../../container';
import Command     from '../../../../dist/node/console/Command';
import ListCommand from '../../../../dist/node/console/commands/ListCommand';


//-- Given
//--------------------------------------------------------

given.fakeCommand = () => {
	const command = class extends Command {

		get name() { return 'foo:bar'; }

	};
	container.make('command').add(command);
};

given.listCommand = () => {
	given.command(ListCommand);
};


//-- Then
//--------------------------------------------------------

then.shouldHaveListed = (lines) => {
	lines.forEach((line) => {
		then.shouldHaveOutput(line);
	});
};

then.shouldHaveListedHeaderAndOptions = () => {
	then.shouldHaveListed([
		'Node IoC',
		'Usage:',
		'command [arguments] [options]',
		'Available commands:',
		/^\s*Options:$/u,
		/^\s*--help /u,
		/^\s*--version /u,
		/^\s*-v, --verbose /u
	]);
};

then.shouldHaveListedAllCommands = () => {
	then.shouldHaveListedHeaderAndOptions();
};

then.shouldHaveListedFakeCommand = () => {
	then.shouldHaveListed([
		'foo',
		/^\s*foo:bar /u
	]);
};


export default build({ given, when, then });
