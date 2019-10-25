//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Command Registrar
//--------------------------------------------------------

import gwt from './CommandRegistrar.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeCommandRepository();
	given.fakeCommandRunner();
	given.fakeFileManager();
	given.fakeTerminal();
	given.fakeYargs();
	given.commandRegistrar();
});


test('Can add a command and forward it to the command repository', () => {
	when.addingCommand();
	then.commandShouldBeAddedIntoRepository();
});

test('Can add all commands in a given folder and forward them to the command repository', () => {
	when.addingCommandsFromFolder();
	then.allCommandsInFolderShouldBeAddedIntoRepository();
});

test('Does not add any command and does not throw if the given folder is empty', () => {
	when.addingCommandsFromEmptyFolder();
	then.noCommandsAreAddedIntoRepository();
});

test('Set a default command to be executed if no command has been provided when running the application', () => {
	when.settingDefaultCommand();
	then.defaultCommandShouldBeAddedIntoRepository();
});

test('Can get the default command instance', () => {
	when.settingDefaultCommand();
	when.gettingDefaultCommand();
	then.shouldHaveReceivedDefaultCommandFromRepository();
});

test('Can resolve the command by name and run it', async () => {
	given.command();
	await when.resolvingCommand();
	then.commandShouldHaveRun();
});

test('Can resolve current command and run it', async () => {
	given.command();
	given.currentArgv('foo');
	await when.resolving();
	then.commandShouldHaveRun();
});

test('Can resolve the command by name and run it only if policies allow it', async () => {
	given.privateCommand();
	await when.resolvingPrivateCommand();
	then.privateCommandShouldNotHaveBeenBootstrapped();
});

test('Can resolve the command by name and run it regardless of the policies', async () => {
	given.privateCommand();
	await when.resolvingPrivateCommandInternally();
	then.privateCommandShouldHaveRun();
});

test('Can bootstrap a yargs instance without running it', () => {
	given.yargsInstance();
	given.privateCommand();
	when.bootstrappingPrivateCommandNameWithoutPolicies();
	then.privateCommandShouldHaveBeenBootstrapped();
});

test('Can bootstrap a yargs instance with only allowed commands without running it', () => {
	given.yargsInstance();
	given.privateCommand();
	when.bootstrappingPrivateCommandName();
	then.privateCommandShouldNotHaveBeenBootstrapped();
});
