//--------------------------------------------------------
//-- Tests - Unit - Config - Repositories - Config Repository
//--------------------------------------------------------

import gwt from './ConfigRepository.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeConfigGrammar();
	given.emptyConfigRepository();
});


test('Configuration are by default empty', () => {
	given.nullFileManager();
	when.gettingAllConfig();
	then.shouldHaveEmptyObject();
});


describe('With fake file manager', () => {

	beforeEach(() => {
		given.fakeFileManager();
		given.emptyConfig();
		given.mainFolder();
	});


	test('Can read configuration from folder configured in the application', () => {
		given.config({ key: 'value' });
		when.gettingAllConfig();
		then.shouldHaveReadFilesInConfigFolder();
	});

	test('Can get configuration value with dotted-syntax', () => {
		given.config({ key: { sub: 'value' } });
		when.gettingConfig('key.sub');
		then.resultShouldBe('value');
	});

	test('Can get configuration collection', () => {
		const config = { sub: 'value' };
		given.config({ file: { key: config } });
		when.gettingConfig('file.key');
		then.resultShouldEqual(config);
	});

	test('Can get null if config is undefined', () => {
		given.config({ file: { key: 'value' } });
		when.gettingConfig('file.foo');
		then.resultShouldBe(null);
	});

	test('Can get default value if config is undefined', () => {
		given.config({ file: { key: 'value' } });
		when.gettingConfig('file.foo', 'bar');
		then.resultShouldBe('bar');
	});

	test('Can get value if config is defined and default value is provided', () => {
		given.config({ file: { key: 'value' } });
		when.gettingConfig('file.key', 'bar');
		then.resultShouldBe('value');
	});

	test('Can get falsy value if set in config instead of default value', () => {
		given.config({ file: { key: false } });
		when.gettingConfig('file.key', 'value');
		then.resultShouldBe(false);
	});

	test('Can add configuration value', () => {
		when.settingConfig('otherKey', 'value');
		then.configShouldEqual({ otherKey: 'value' });
	});

	test('Can add configuration value with dotted-syntax', () => {
		when.settingConfig('some.key', 'value');
		then.configShouldEqual({ some: { key: 'value' } });
	});

	test('Can add configuration from object instead of key-paired value', () => {
		when.settingConfig({ key: 'value' });
		then.configShouldEqual({ key: 'value' });
	});

	test('Can add configuration collection', () => {
		when.settingConfig('some', { key: 'value' });
		then.configShouldEqual({ some: { key: 'value' } });
	});

	test('Can change configuration value', () => {
		given.config({ file: { key: 'value' } });
		when.settingConfig('file.key', 'other value');
		then.configShouldEqual({ file: { key: 'other value' } });
	});

	test('Can change configuration collection', () => {
		given.config({ some: { key: 'value' } });
		when.settingConfig('some', { key: 'other value' });
		then.configShouldEqual({ some: { key: 'other value' } });
	});

	test('Config is formatted by the grammar between setting and getting value', () => {
		given.config({ file: { foo: '{{UNEXISTING_ENV_VARIABLE|bar}}' } });
		when.gettingConfig('file.foo');
		then.formatShouldHaveBeenCalledOnGrammar();
	});

	test('Can load configuration files from given folder', () => {
		given.otherFolder();
		given.configInOtherFolder({ other: { foo: 'config' } });
		when.loadingFolder();
		when.gettingConfig('other.foo');
		then.resultShouldBe('config');
	});

	test('Ignore other folder if not specified', () => {
		given.configInOtherFolder({ other: { foo: 'config' } });
		when.loadingFolder();
		when.gettingConfig('other.foo');
		then.resultShouldBe(null);
	});

	test('Does not throw if given configuration folder to load does not exists', () => {
		given.unexistingFolder();
		when.loadingFolder();
		then.shouldNotHaveThrown();
		then.configShouldEqual({});
	});

	test('Does not throw if given configuration folder to load is empty', () => {
		given.emptyFolder();
		when.loadingFolder();
		then.shouldNotHaveThrown();
		then.configShouldEqual({});
	});

	test('Can rely on a single file as configuration', () => {
		given.configFile();
		when.loadingFile();
		then.configShouldEqualConfigFile();
	});

	test('Does not throw and does not impact configuration if single file does not exists', () => {
		given.config({ file: { foo: 'bar' } });
		given.unexistingConfigFile();
		when.loadingFile();
		then.shouldNotHaveThrown();
		then.configShouldEqual({ file: { foo: 'bar' } });
	});

	test('Does not throw and does not impact configuration if single file is empty', () => {
		given.config({ file: { foo: 'bar' } });
		given.emptyConfigFile();
		when.loadingFile();
		then.shouldNotHaveThrown();
		then.configShouldEqual({ file: { foo: 'bar' } });
	});

});
