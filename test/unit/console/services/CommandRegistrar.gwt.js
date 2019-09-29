//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Command Registrar - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container        = require('../../container');
const CommandRegistrar = require('../../../../lib/console/services/CommandRegistrar');
const Command          = require('../../../../lib/console/Command');

const folder      = '/path/to/folder';
const emptyFolder = '/path/to/empty/folder';

let commandRegistrar;
let yargs;
let commands;
let files;
let result;
let currentArgv;


//-- Mocks
//--------------------------------------------------------

const command = container.make(class extends Command {

	get policies() { return ['public']; }
	get name() { return 'foo'; }
	handle() { return 'Foo has handled'; }

});

const privateCommand = container.make(class extends Command {

	get policies() { return ['private']; }
	get name() { return 'bar'; }

});

const fakeCommandRepository = {
	all: jest.fn((withPolicies) => {
		return commands.filter(({ policies }) => {
			return !withPolicies || !policies.includes('private');
		});
	}),
	add: jest.fn((item) => {
		commands.push(item);
	}),
	get: jest.fn((name) => {
		return commands.find(({ name: n }) => { return n === name; });
	})
};

const fakeCommandRunner = {
	run: jest.fn(() => { return Promise.resolve(); })
};

const fakeFileManager = {
	scandir: jest.fn((folderPath) => {
		if (folderPath === folder) {
			return [
				`${folder}/FooCommand.js`,
				`${folder}/BarCommand.js`
			];
		}

		return [];
	}),
	load: jest.fn((file) => { return files[file]; })
};

const fakeTerminal = {};

const fakeYargsFactory = () => {
	const factoriedYargs = jest.fn((argv) => {
		currentArgv = argv || currentArgv;

		return factoriedYargs;
	});

	factoriedYargs._commands = {};

	['option', 'count', 'exitProcess', 'showHelpOnFail', 'locale', 'strict', 'wrap', 'terminalWidth'].forEach((method) => {
		factoriedYargs[method] = jest.fn(() => { return factoriedYargs; });
	});

	factoriedYargs.command = jest.fn(({ command: commandName, handler }) => {
		factoriedYargs._commands[commandName] = handler;

		return factoriedYargs;
	});

	factoriedYargs.parse = jest.fn(() => {
		(factoriedYargs._commands[currentArgv] || jest.fn())();
	});

	return factoriedYargs;
};

const fakeYargs = fakeYargsFactory();


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeCommandRepository = () => {
	container.singleton('command', fakeCommandRepository);
	commands = [];
};

given.fakeCommandRunner = () => {
	container.singleton('command.runner', fakeCommandRunner);
};

given.fakeFileManager = () => {
	container.singleton('file', fakeFileManager);
	files = {
		[`${folder}/FooCommand.js`]: command,
		[`${folder}/BarCommand.js`]: privateCommand
	};
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.fakeYargs = () => {
	container.singleton('yargs', fakeYargs);
	yargs = fakeYargs;

	currentArgv = undefined;
};

given.commandRegistrar = () => {
	commandRegistrar = container.make(CommandRegistrar);
};

given.command = () => {
	commands.push(command);
};

given.privateCommand = () => {
	commands.push(privateCommand);
};

given.yargsInstance = () => {
	yargs = fakeYargsFactory();
};

given.currentArgv = (argv) => {
	currentArgv = argv;
};


//-- When
//--------------------------------------------------------

when.addingCommand = () => {
	when.attempting(() => {
		commandRegistrar.add(command);
	});
};

when.addingCommandsFrom = (folderPath) => {
	when.attempting(() => {
		commandRegistrar.addFromFolder(folderPath);
	});
};

when.addingCommandsFromFolder = () => {
	when.addingCommandsFrom(folder);
};

when.addingCommandsFromEmptyFolder = () => {
	when.addingCommandsFrom(emptyFolder);
};

when.settingDefaultCommand = () => {
	when.attempting(() => {
		commandRegistrar.setDefault(command);
	});
};

when.gettingDefaultCommand = () => {
	when.attempting(() => {
		result = commandRegistrar.getDefault();
	});
};

when.resolving = async (...parameters) => {
	await when.attemptingAsync(async () => {
		await commandRegistrar.resolve(...parameters);
	});
};

when.resolvingCommand = async () => {
	await when.resolving('foo');
};

when.resolvingPrivateCommand = async () => {
	await when.resolving('bar');
};

when.resolvingPrivateCommandInternally = async () => {
	await when.resolving('bar', true);
};

when.bootstrappingPrivateCommandName = () => {
	when.attempting(() => {
		commandRegistrar.bootstrap(yargs);
	});
};

when.bootstrappingPrivateCommandNameWithoutPolicies = () => {
	when.attempting(() => {
		commandRegistrar.bootstrap(yargs, false);
	});
};


//-- Then
//--------------------------------------------------------

then.commandShouldBeAddedIntoRepository = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRepository.add).toHaveBeenCalled();
	const hasReceivedCommand = fakeCommandRepository.add.mock.calls.some(([item]) => {
		return item === command;
	});
	expect(hasReceivedCommand).toBe(true);
};

then.allCommandsInFolderShouldBeAddedIntoRepository = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.scandir).toHaveBeenCalled();
	expect(fakeFileManager.load).toHaveBeenCalledTimes(2);
	expect(fakeCommandRepository.add).toHaveBeenCalledTimes(2);
	const hasReceivedCommand = fakeCommandRepository.add.mock.calls.some(([item]) => {
		return item === command;
	});
	const hasReceivedPrivateCommand = fakeCommandRepository.add.mock.calls.some(([item]) => {
		return item === privateCommand;
	});
	expect(hasReceivedCommand).toBe(true);
	expect(hasReceivedPrivateCommand).toBe(true);
};

then.noCommandsAreAddedIntoRepository = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.scandir).toHaveBeenCalled();
	expect(fakeFileManager.load).not.toHaveBeenCalled();
	expect(fakeCommandRepository.add).not.toHaveBeenCalled();
};

then.defaultCommandShouldBeAddedIntoRepository = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRepository.add).toHaveBeenCalled();
	const hasReceivedCommand = fakeCommandRepository.add.mock.calls.some(([item]) => {
		return item instanceof command.constructor;
	});
	expect(hasReceivedCommand).toBe(true);
};

then.shouldHaveReceivedDefaultCommandFromRepository = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(result).toBeInstanceOf(Command);
	expect(result.name).toBe('*');
	expect(result.description).toContain(command.name);
	expect(result.handle()).toBe(command.handle());
};

then.commandShouldHaveRun = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRunner.run).toHaveBeenCalledTimes(1);
	expect(fakeCommandRunner.run.mock.calls[0][0]).toBe(command);
};

then.defaultCommandShouldHaveRun = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRunner.run).toHaveBeenCalledTimes(1);
	const [[firstArgument]] = fakeCommandRunner.run.mock.calls;
	expect(firstArgument).toBeInstanceOf(Command);
	expect(firstArgument.name).toBe('*');
};

then.privateCommandShouldHaveRun = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRunner.run).toHaveBeenCalledTimes(1);
	expect(fakeCommandRunner.run.mock.calls[0][0]).toBe(privateCommand);
};

then.privateCommandShouldHaveBeenBootstrapped = (expected = true) => {
	then.shouldNotHaveThrown();
	const hasReceivedCommand = yargs.command.mock.calls.some(([{ command: name }]) => {
		return name === privateCommand.name;
	});

	expect(hasReceivedCommand).toBe(expected);
};

then.privateCommandShouldNotHaveBeenBootstrapped = () => {
	then.privateCommandShouldHaveBeenBootstrapped(false);
};


module.exports = build({ given, when, then });
