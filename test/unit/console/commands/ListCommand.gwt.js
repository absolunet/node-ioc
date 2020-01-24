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
		'commands.list.messages.usage {}:',
		'commands.list.messages.usage-example {}',
		'commands.list.messages.available-commands {}:',
		/^\s*commands\.yargs\.options \{\}$/u,
		/^\s*--help\s*commands\.list\.flags\.help \{\} /u,
		/^\s*--version\s*commands\.list\.flags\.version \{\} /u,
		/^\s*-v, --verbose\s*commands\.list\.flags\.verbose \{\} /u
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

then.yargsStringsShouldHaveBeenTranslated = () => {
	[
		'commands.list.flags.help',
		'commands.list.flags.version',
		'commands.list.flags.verbose',
		'commands.list.messages.usage',
		'commands.list.messages.usage-example',
		'commands.list.messages.available-commands',
		'commands.yargs.positionals'
	].forEach((key) => {
		then.shouldHaveTranslated(key);
	});
};


export default build({ given, when, then });
