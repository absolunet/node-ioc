//--------------------------------------------------------
//-- Tests - Unit - Foundation - Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container       = require('../container');
const Command         = require('../../../dist/node/console/Command');
const ServiceProvider = require('../../../dist/node/foundation/ServiceProvider');

let serviceProvider;
let commands;


//-- Mocks
//--------------------------------------------------------

const fakeCommandRepository = {
	add: jest.fn()
};

const FakeCommand      = class extends Command {};
const OtherFakeCommand = class extends Command {};


//-- Given
//--------------------------------------------------------

given.fakeCommandRepository = () => {
	container.singleton('command', fakeCommandRepository);
};

given.provider = () => {
	serviceProvider = container.make(ServiceProvider, { app: container });
};

given.fakeCommands = () => {
	commands = [FakeCommand, OtherFakeCommand];
};


//-- When
//--------------------------------------------------------

when.loadingCommands = () => {
	when.attempting(() => {
		serviceProvider.loadCommands(commands);
	});
};


//-- Then
//--------------------------------------------------------

then.commandShouldHaveBeenLoaded = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRepository.add).toHaveBeenCalledTimes(commands.length);
	const hasLoadedAllCommands = fakeCommandRepository.add.mock.calls.every(([command]) => {
		return commands.includes(command);
	});
	expect(hasLoadedAllCommands).toBe(true);
};


module.exports = build({ given, when, then });
