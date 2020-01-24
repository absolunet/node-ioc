//--------------------------------------------------------
//-- Tests - Unit - Foundation - Application - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import Application     from '../../../dist/node/foundation/Application';
import ServiceProvider from '../../../dist/node/foundation/ServiceProvider';

let application;
let fakeConfig;
let result;


//-- Mocks
//--------------------------------------------------------

const Provider = class extends ServiceProvider {};
Provider.prototype.register = jest.fn();
Provider.prototype.boot     = jest.fn();

const OtherProvider = class extends ServiceProvider {};
OtherProvider.prototype.register = jest.fn();
OtherProvider.prototype.boot     = jest.fn();

const ProviderRegisteringOtherProviderOnRegister = class extends ServiceProvider {

	register() {
		this._register();
		this.app.register(OtherProvider);
	}

};
ProviderRegisteringOtherProviderOnRegister.prototype._register = jest.fn();
ProviderRegisteringOtherProviderOnRegister.prototype.boot      = jest.fn();

const ProviderRegisteringOtherProviderOnBoot = class extends ServiceProvider {

	boot() {
		this._boot();
		this.app.register(OtherProvider);
	}

};
ProviderRegisteringOtherProviderOnBoot.prototype.register = jest.fn();
ProviderRegisteringOtherProviderOnBoot.prototype._boot    = jest.fn();

const fakeDispatcher = {
	removeAllListeners: jest.fn()
};

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	}),
	set: jest.fn((key, value) => {
		fakeConfig[key] = value;
	})
};

const fakeListener = jest.fn();


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.application = () => {
	delete Application.instance;
	application = Application.make();
};

given.registeredProvider = () => {
	application.register(Provider);
};

given.registeredProviderRegisteringOtherProviderOnRegister = () => {
	application.register(ProviderRegisteringOtherProviderOnRegister);
};

given.registeredProviderRegisteringOtherProviderOnBoot = () => {
	application.register(ProviderRegisteringOtherProviderOnBoot);
};

given.fakeDispatcher = () => {
	application.singleton('event', fakeDispatcher);
};

given.fakeConfigRepository = () => {
	application.singleton('config', fakeConfigRepository);
	fakeConfig = {};
};

given.fakeEnvironmentInConfiguration = () => {
	fakeConfig['app.env'] = 'fake';
};

given.bootingListener = () => {
	application.onBooting(fakeListener);
};

given.bootedListener = () => {
	application.onBooted(fakeListener);
};

given.fakePath = () => {
	application.bind('path.fake', '/fake/path');
};

given.fakePathFromBasePath = () => {
	application.bind('path.fake', `${application.make('path.base')}/fake/path`);
};

given.fakePublicPath = () => {
	result = application.make('path.public');
	application.bind('path.public', '/fake/public/path');
};


//-- When
//--------------------------------------------------------

when.getting = (property) => {
	when.attempting(() => {
		result = application[property];
	});
};

when.calling = (method, parameters = []) => {
	when.attempting(() => {
		result = application[method](...parameters);
	});
};

when.callingWithoutResult = (method, parameters = []) => {
	when.attempting(() => {
		application[method](...parameters);
	});
};

when.booting = () => {
	when.callingWithoutResult('boot');
};

when.bootingIfNotAlreadyBooted = () => {
	when.callingWithoutResult('bootIfNotBooted');
};

when.checkingIfWasBooted = () => {
	when.getting('booted');
};

when.registeringProvider = () => {
	when.callingWithoutResult('register', [Provider]);
};

when.bootingCoreProviders = () => {
	when.callingWithoutResult('bootCoreProviders');
};

when.addingBootingListener = () => {
	when.calling('onBooting', [fakeListener]);
};

when.addingBootedListener = () => {
	when.calling('onBooted', [fakeListener]);
};

when.gettingFileManagerSingleton = () => {
	when.calling('make', ['file']);
};

when.checkingIfProviderWasRegistered = () => {
	when.calling('isRegistered', [Provider]);
};

when.flushing = () => {
	when.callingWithoutResult('flush');
};

when.gettingEnvironment = () => {
	when.getting('environment');
};

when.settingEnvironment = () => {
	when.callingWithoutResult('setEnvironment', ['fake']);
};

when.settingEnvironmentByAssignation = () => {
	when.attempting(() => {
		application.environment = 'fake';
	});
};

when.configuringFakePath = () => {
	when.callingWithoutResult('configurePaths', [{ fake: '/fake/path' }]);
};

when.configuringDefaultPaths = () => {
	when.callingWithoutResult('configureDefaultPaths');
};

when.gettingBindings = () => {
	when.calling('getBounds');
};

when.usingNewBasePath = () => {
	when.callingWithoutResult('useBasePath', ['/new/base/path']);
};

when.usingNewAppPath = () => {
	when.callingWithoutResult('useAppPath', ['new/app/path']);
};

when.usingNewSourcePath = () => {
	when.callingWithoutResult('useSourcePath', ['lib']);
};

when.usingNewDistributionPath = () => {
	when.callingWithoutResult('useDistributionPath', ['new/dist/path']);
};

when.usingNewHomePath = () => {
	when.callingWithoutResult('useHomePath', ['/new/home/path']);
};

when.formattingWindowsPath = () => {
	when.calling('formatPath', ['some\\windows\\path']);
};

when.settingNewApplicationVersion = () => {
	when.callingWithoutResult('setVersion', ['12.34.56']);
};

when.gettingSourcePath = () => {
	when.calling('sourcePath');
};

when.gettingDistributionPath = () => {
	when.calling('distributionPath');
};


//-- Then
//--------------------------------------------------------

then.resultShouldBeBinding = (binding) => {
	then.resultShouldBe(application.make(binding));
};

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.providerShouldNotHaveRegisteredOrBooted = () => {
	then.shouldNotHaveThrown();
	expect(Provider.prototype.register).not.toHaveBeenCalled();
	expect(Provider.prototype.boot).not.toHaveBeenCalled();
};

then.shouldBeBooted = () => {
	then.shouldNotHaveThrown();
	expect(application.booted).toBe(true);
};

then.providerShouldHaveRegisteredAndBooted = () => {
	then.shouldNotHaveThrown();
	expect(Provider.prototype.register).toHaveBeenCalled();
	expect(Provider.prototype.boot).toHaveBeenCalled();
};

then.otherProviderShouldHaveRegisteredAndBooted = () => {
	then.shouldNotHaveThrown();
	expect(OtherProvider.prototype.register).toHaveBeenCalledTimes(1);
	expect(OtherProvider.prototype.boot).toHaveBeenCalledTimes(1);
};

then.providerRegisteringOtherProviderShouldHaveRegisteredAndBooted = () => {
	then.shouldNotHaveThrown();
	expect(ProviderRegisteringOtherProviderOnRegister.prototype._register).toHaveBeenCalled();
	expect(ProviderRegisteringOtherProviderOnRegister.prototype.boot).toHaveBeenCalled();
};

then.coreProvidersShouldBeBooted = () => {
	then.shouldNotHaveThrown();
	expect(application.isBound('config')).toBe(true);
	expect(application.isBound('event')).toBe(true);
	expect(application.isBound('file')).toBe(true);
	expect(application.isBound('helper.string')).toBe(true);
};

then.fileManagerShouldBeSameSingleton = () => {
	then.resultShouldBeBinding('file');
};

then.providerShouldHaveRegisteredAndBootedOnce = () => {
	then.providerShouldHaveRegisteredAndBooted();
	expect(Provider.prototype.register).toHaveBeenCalledTimes(1);
	expect(Provider.prototype.boot).toHaveBeenCalledTimes(1);
};

then.eventListenersShouldHaveBeenRemoved = () => {
	then.shouldNotHaveThrown();
	expect(fakeDispatcher.removeAllListeners).toHaveBeenCalled();
};

then.listenerShouldNotHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(fakeListener).not.toHaveBeenCalled();
};

then.listenerShouldHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(fakeListener).toHaveBeenCalledTimes(1);
};

then.listenerShouldHaveBeenCalledBeforeRegisteringProvider = () => {
	then.listenerShouldHaveBeenCalled();
	expect(fakeListener.mock.invocationCallOrder[0]).toBeLessThan(Provider.prototype.register.mock.invocationCallOrder[0]);
};

then.listenerShouldHaveBeenCalledAfterBootingProvider = () => {
	then.listenerShouldHaveBeenCalled();
	expect(fakeListener.mock.invocationCallOrder[0]).toBeGreaterThan(Provider.prototype.boot.mock.invocationCallOrder[0]);
};

then.shouldHaveReceivedEnvironmentInConfiguration = () => {
	then.resultShouldBe(fakeConfig['app.env']);
};

then.configShouldHaveNewEnvironment = () => {
	expect(fakeConfigRepository.set).toHaveBeenCalledWith('app.env', 'fake');
};

then.shouldHaveFakePathBound = () => {
	then.shouldNotHaveThrown();
	expect(application.isBound('path.fake')).toBe(true);
	expect(application.make('path.fake')).toBe('/fake/path');
};

then.shouldHaveOriginalPublicPath = () => {
	then.resultShouldBeBinding('path.public');
};

then.shouldHaveDefaultPathsBound = () => {
	then.shouldNotHaveThrown();
	expect(application.isBound('path.home')).toBe(true);
	expect(application.isBound('path.base')).toBe(true);
	expect(application.isBound('path.config')).toBe(true);
	expect(application.isBound('path.controller')).toBe(true);
	expect(application.isBound('path.command')).toBe(true);
	expect(application.isBound('path.database')).toBe(true);
	expect(application.isBound('path.lang')).toBe(true);
	expect(application.isBound('path.policy')).toBe(true);
	expect(application.isBound('path.provider')).toBe(true);
	expect(application.isBound('path.public')).toBe(true);
	expect(application.isBound('path.resources')).toBe(true);
	expect(application.isBound('path.routes')).toBe(true);
	expect(application.isBound('path.storage')).toBe(true);
	expect(application.isBound('path.test')).toBe(true);
	expect(application.isBound('path.view')).toBe(true);
};

then.basePathShouldBeNewBasePath = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.base')).toBe('/new/base/path');
};

then.fakePathShouldBePrefixedByNewBasePath = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.fake')).toBe('/new/base/path/fake/path');
};

then.appPathShouldBeNewAppPath = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.app')).toBe(`${application.make('path.base')}/dist/node/new/app/path`);
	expect(application.make('path.src.app')).toBe(`${application.make('path.base')}/src/new/app/path`);
};

then.appPathShouldNotHaveChanged = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.app')).toBe(`${application.make('path.base')}/dist/node/app`);
};

then.appSourcePathShouldUseNewSourcePath = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.src.app')).toBe(`${application.make('path.base')}/lib/app`);
};

then.appPathShouldUseNewDistributionPath = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.app')).toBe(`${application.make('path.base')}/new/dist/path/app`);
};

then.appSourcePathShouldNotHaveChanged = () => {
	expect(application.make('path.src.app')).toBe(`${application.make('path.base')}/src/app`);
};

then.fakePathShouldNotHaveChanged = () => {
	expect(application.make('path.fake')).toBe('/fake/path');
};

then.providerPathShouldBePrefixedByNewAppPath = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.provider')).toBe(`${application.make('path.base')}/dist/node/new/app/path/providers`);
	expect(application.make('path.src.provider')).toBe(`${application.make('path.base')}/src/new/app/path/providers`);
};

then.homePathShouldHaveChanged = () => {
	then.shouldNotHaveThrown();
	expect(application.make('path.home')).toBe('/new/home/path');
};

then.pathShouldBeUnixPath = () => {
	then.shouldNotHaveThrown();
	expect(result).toMatch(/^[^\\]+$/u);
};

then.applicationShouldHaveNewVersion = () => {
	then.shouldNotHaveThrown();
	expect(application.version).toBe('12.34.56');
};

then.resultShouldBeFormattedPathFromBinding = (binding, pathParts) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(`${application.make(binding)}/${pathParts.join('/')}`);
};


export default build({ given, when, then });
