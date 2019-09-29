//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - List Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container   = require('../../container');
const Command     = require('../../../../lib/console/Command');
const ListCommand = require('../../../../lib/console/commands/ListCommand');


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


module.exports = build({ given, when, then });
