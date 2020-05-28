//--------------------------------------------------------
//-- Tests - Unit - Foundation - Application
//--------------------------------------------------------

import gwt from './Application.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.application();
});


test('Can boot', () => {
	when.booting();
	then.shouldBeBooted();
	then.providerShouldNotHaveRegisteredOrBooted();
});

test('Can boot if not already booted', () => {
	when.booting();
	when.bootingIfNotAlreadyBooted();
	then.shouldBeBooted();
});

test('Throws if already booted', () => {
	when.booting();
	when.booting();
	then.shouldHaveThrown();
});

test('Can check if the application was not already booted', () => {
	when.checkingIfWasBooted();
	then.resultShouldBe(false);
});

test('Can check if the application was already booted', () => {
	when.booting();
	when.checkingIfWasBooted();
	then.resultShouldBe(true);
});

test('Can register a service provider', () => {
	given.registeredProvider();
	when.booting();
	then.providerShouldHaveRegisteredAndBooted();
});

test('Can register a service provider that will be immediately booted if application is already booted', () => {
	when.booting();
	when.registeringProvider();
	then.providerShouldHaveRegisteredAndBooted();
});

test('A provider can register another provider during the register phase', () => {
	given.registeredProviderRegisteringOtherProviderOnRegister();
	when.booting();
	then.providerRegisteringOtherProviderShouldHaveRegisteredAndBooted();
	then.otherProviderShouldHaveRegisteredAndBooted();
});

test('A provider cannot register another provider during the boot phase', () => {
	given.registeredProviderRegisteringOtherProviderOnBoot();
	when.booting();
	then.shouldHaveThrownApplicationBootingErrorMatching(/^Cannot register a service provider during the booting phase/u);
});

test('Can manually boot core providers', () => {
	when.bootingCoreProviders();
	then.coreProvidersShouldBeBooted();
});

test('Throws if manually booting core providers while already booted', () => {
	when.booting();
	when.bootingCoreProviders();
	then.shouldHaveThrown();
});

test('Throws a specific exception if an error is thrown during the registering phase', () => {
	given.registeredProviderThatThrowsDuringRegisteringPhase();
	when.booting();
	then.shouldHaveThrownApplicationBootingError();
});

test('Throws a specific exception if an error is thrown during the booting phase', () => {
	given.registeredProviderThatThrowsDuringBootingPhase();
	when.booting();
	then.shouldHaveThrownApplicationBootingError();
});

test('Can manually boot core provider and boot application afterwards', () => {
	when.bootingCoreProviders();
	when.gettingFileManagerSingleton();
	when.booting();
	then.fileManagerShouldBeSameSingleton();
});

test('Can check if a given provider was not already registered', () => {
	when.checkingIfProviderWasRegistered();
	then.resultShouldBe(false);
});

test('Can check if a given provider was already registered', () => {
	given.registeredProvider();
	when.checkingIfProviderWasRegistered();
	then.resultShouldBe(true);
});

test('Cannot register the same provider twice', () => {
	given.registeredProvider();
	when.booting();
	when.registeringProvider();
	then.providerShouldHaveRegisteredAndBootedOnce();
});

test('Can flush the application and expect providers to be unregistered', () => {
	given.registeredProvider();
	when.flushing();
	when.checkingIfProviderWasRegistered();
	then.resultShouldBe(false);
});

test('Can flush the application and expect event listeners to be removed', () => {
	given.fakeDispatcher();
	when.flushing();
	then.eventListenersShouldHaveBeenRemoved();
});

test('Can register a listener to be triggered prior to boot phase', () => {
	given.bootingListener();
	given.registeredProvider();
	when.booting();
	then.listenerShouldHaveBeenCalledBeforeRegisteringProvider();
});

test('Cannot register a listener to be triggered prior to boot phase after the boot phase', () => {
	when.booting();
	when.addingBootingListener();
	then.listenerShouldNotHaveBeenCalled();
});

test('Can register a listener to be triggered after to boot phase', () => {
	given.bootedListener();
	given.registeredProvider();
	when.booting();
	then.listenerShouldHaveBeenCalledAfterBootingProvider();
});

test('Can register a listener to be triggered prior to boot phase after the boot phase', () => {
	when.booting();
	when.addingBootedListener();
	then.listenerShouldHaveBeenCalled();
});

test('Can get current application environment', () => {
	given.fakeConfigRepository();
	given.fakeEnvironmentInConfiguration();
	when.gettingEnvironment();
	then.shouldHaveReceivedEnvironmentInConfiguration();
});

test('Can set application environment', () => {
	given.fakeConfigRepository();
	given.fakeEnvironmentInConfiguration();
	when.settingEnvironment();
	then.configShouldHaveNewEnvironment();
});

test('Can set application environment by assignation', () => {
	given.fakeConfigRepository();
	given.fakeEnvironmentInConfiguration();
	when.settingEnvironmentByAssignation();
	then.configShouldHaveNewEnvironment();
});

test('Can configure paths', () => {
	when.configuringFakePath();
	then.shouldHaveFakePathBound();
});

test('Can reset default paths', () => {
	given.fakePath();
	given.fakePublicPath();
	when.configuringDefaultPaths();
	then.shouldHaveFakePathBound();
	then.shouldHaveOriginalPublicPath();
});

test('Has default paths', () => {
	when.gettingBindings();
	then.shouldHaveDefaultPathsBound();
});

test('Can configure base path', () => {
	given.fakePathFromBasePath();
	when.usingNewBasePath();
	then.basePathShouldBeNewBasePath();
	then.fakePathShouldBePrefixedByNewBasePath();
});

test('Can configure application path', () => {
	given.fakePath();
	when.usingNewAppPath();
	then.appPathShouldBeNewAppPath();
	then.fakePathShouldNotHaveChanged();
	then.providerPathShouldBePrefixedByNewAppPath();
});

test('Can configure source path', () => {
	given.fakePath();
	when.usingNewSourcePath();
	then.appSourcePathShouldUseNewSourcePath();
	then.appPathShouldNotHaveChanged();
	then.fakePathShouldNotHaveChanged();
});

test('Can configure distribution path', () => {
	given.fakePath();
	when.usingNewDistributionPath();
	then.appSourcePathShouldNotHaveChanged();
	then.appPathShouldUseNewDistributionPath();
	then.fakePathShouldNotHaveChanged();
});

test('Can configure home directory path', () => {
	when.usingNewHomePath();
	then.homePathShouldHaveChanged();
});

test('Can format path to be the same under UNIX and Windows systems', () => {
	when.formattingWindowsPath();
	then.pathShouldBeUnixPath();
});

test('Can set application version', () => {
	when.settingNewApplicationVersion();
	then.applicationShouldHaveNewVersion();
});

test('Can get source path', () => {
	when.gettingSourcePath();
	then.resultShouldBeBinding(`path.src`);
});

test('Can get distribution path', () => {
	when.gettingDistributionPath();
	then.resultShouldBeBinding(`path.dist`);
});

[
	'home',
	'base',
	'config',
	'controller',
	'command',
	'database',
	'lang',
	'policy',
	'provider',
	'public',
	'resources',
	'routes',
	'storage',
	'test',
	'upload',
	'view'
]
	.forEach((type) => {
		test(`Can get ${type} path`, () => {
			when.calling(`${type}Path`);
			then.resultShouldBeBinding(`path.${type}`);
		});

		test(`Can get absolute path of given relative path from ${type} path`, () => {
			when.calling(`${type}Path`, [['foo', 'bar']]);
			then.resultShouldBeFormattedPathFromBinding(`path.${type}`, ['foo', 'bar']);
		});
	});

[
	'controller',
	'command',
	'database',
	'policy',
	'provider',
	'routes'
]
	.forEach((type) => {
		test(`Can get ${type} source path`, () => {
			when.calling('sourcePath', [type, '']);
			when.calling('sourcePath', [type, '']);
			then.resultShouldBeBinding(`path.src.${type}`);
		});

		test(`Can get absolute path of given relative path from ${type} path`, () => {
			when.calling('sourcePath', [type, ['foo', 'bar']]);
			then.resultShouldBeFormattedPathFromBinding(`path.src.${type}`, ['foo', 'bar']);
		});
	});
