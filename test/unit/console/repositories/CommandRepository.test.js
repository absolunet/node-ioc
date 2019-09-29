//--------------------------------------------------------
//-- Tests - Unit - Console - Repositories - Command Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CommandRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeTerminal();
	given.fakeGateService();
	given.commandRepository();
	given.emptyResult();
});


test('Can get all registered commands', () => {
	given.command();
	given.privateCommand();
	when.gettingAllWithoutPolicies();
	then.shouldHaveCommandAndPrivateCommand();
});

test('Can get all registered commands that pass policies', () => {
	given.command();
	given.privateCommand();
	when.gettingAllWithPolicies();
	then.shouldHaveCommand();
	then.shouldNotHavePrivateCommand();
});

test('Can get all registered commands as groups', () => {
	given.command();
	given.privateCommand();
	given.namespaceCommand();
	given.otherNamespaceCommand();
	when.gettingAllGroupedWithoutPolicies();
	then.shouldHaveTwoGroups();
	then.shouldHaveCommandInGlobalGroup();
	then.shouldHavePrivateCommandInGlobalGroup();
	then.shouldHaveNamespaceCommandInNamespaceGroup();
	then.shouldHaveOtherNamespaceCommandInNamespaceGroup();
});

test('Can get all registered command that pass policies as groups', () => {
	given.command();
	given.privateCommand();
	given.namespaceCommand();
	given.otherNamespaceCommand();
	when.gettingAllGroupedWithPolicies();
	then.shouldHaveTwoGroups();
	then.shouldHaveCommandInGlobalGroup();
	then.shouldNotHavePrivateCommandInAnyGroup();
	then.shouldHaveNamespaceCommandInNamespaceGroup();
	then.shouldHaveOtherNamespaceCommandInNamespaceGroup();
});

test('Can get single command instance by command name', () => {
	given.command();
	given.privateCommand();
	when.gettingPrivateCommandByName();
	then.resultShouldBePrivateCommand();
});

test('Does not throw if no command exist when getting by name', () => {
	given.command();
	when.gettingPrivateCommandByName();
	then.resultShouldBe(null);
});

test('Can check if command exists by name', () => {
	given.command();
	when.checkingIfCommandExists();
	then.resultShouldBe(true);
});

test('Can check if command does not exist by name', () => {
	when.checkingIfCommandExists();
	then.resultShouldBe(false);
});

test('Can add a command as constructor', () => {
	given.commandConstructor();
	when.gettingAllWithoutPolicies();
	then.shouldHaveCommand();
});
