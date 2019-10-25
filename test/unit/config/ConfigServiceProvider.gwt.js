//--------------------------------------------------------
//-- Tests - Unit - Config - Config Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container                   from '../container';
import FakeServiceProvider         from './stubs/providers/FakeServiceProvider';
import UnregisteredServiceProvider from './stubs/providers/UnregisteredServiceProvider';

let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const configRepositoryDecorator = jest.fn((configRepository) => {
	configRepository.setConfig(fakeConfig);

	return configRepository;
});

const fakeRegister = jest.fn();
const fakeBoot     = jest.fn();


//-- Given
//--------------------------------------------------------

given.configRepositoryDecorator = () => {
	container.decorate('config', configRepositoryDecorator);
};

given.fakeBasePath = () => {
	container.useBasePath(__dirname);
};

given.emptyConfig = () => {
	fakeConfig = undefined;
};

given.fakeConfigWithOneConfiguredServiceProvider = () => {
	fakeConfig = {
		app: {
			providers: [
				'@/stubs/providers/FakeServiceProvider'
			]
		}
	};
};


given.freshFakeServiceProviders = () => {
	delete FakeServiceProvider.prototype.register;
	delete FakeServiceProvider.prototype.boot;
	delete UnregisteredServiceProvider.prototype.register;
	delete UnregisteredServiceProvider.prototype.boot;
};

given.fakeRegisterOnFakeServiceProviders = () => {
	FakeServiceProvider.prototype.register         = () => { fakeRegister('fake'); };
	FakeServiceProvider.prototype.boot             = () => { fakeBoot('fake'); };
	UnregisteredServiceProvider.prototype.register = () => { fakeRegister('unregistered'); };
	UnregisteredServiceProvider.prototype.boot     = () => { fakeBoot('unregistered'); };
};


//-- Then
//--------------------------------------------------------

then.configRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('config');
};

then.configRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('config');
};

then.environmentRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('env');
};

then.environmentRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('env');
};

then.configGrammarServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('config.grammar');
};

then.configGrammarServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('config.grammar');
};

then.evaluatorServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('evaluator');
};

then.evaluatorServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('evaluator');
};

then.configuredServiceProvidersShouldBeBooted = () => {
	then.shouldNotHaveThrown();
	expect(fakeRegister).toHaveBeenCalledTimes(1);
	expect(fakeRegister).toHaveBeenCalledWith('fake');
	expect(fakeBoot).toHaveBeenCalledTimes(1);
	expect(fakeBoot).toHaveBeenCalledWith('fake');
};


export default build({ given, when, then });
