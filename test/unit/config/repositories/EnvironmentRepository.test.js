//--------------------------------------------------------
//-- Tests - Unit - Config - Repositories - Environment Repository
//--------------------------------------------------------

import gwt from './EnvironmentRepository.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeProcessEnv();
	given.fakeEvaluator();
	given.stubsBasePath();
	given.environmentRepository();
});

afterEach(() => {
	then.resetProcessEnv();
});


test('Can get all environment variables', () => {
	when.gettingAll();
	then.resultShouldEqualProcessEnv();
	then.resultShouldNotBeAllFromRepository();
});


test('Received environment variables are read-only', () => {
	when.gettingAll();
	when.modifyingResult();
	then.resultShouldNotEqualAllFromRepository();
});

test('Can get single environment variable', () => {
	given.processEnv('NEW_ENV_VAR', 'value');
	when.getting('NEW_ENV_VAR');
	then.resultShouldBe('value');
});

test('Can get default value if environment variable does not exists', () => {
	when.getting('NEW_ENV_VAR', 'default value');
	then.resultShouldBe('default value');
});

test('Can get null value instead of default value if environment variable is set to null', () => {
	given.processEnv('NEW_ENV_VAR', null);
	when.getting('NEW_ENV_VAR', 'default value');
	then.resultShouldBe(null);
});

test('Can get null value instead of default value if environment variable is set to ""', () => {
	given.processEnv('NEW_ENV_VAR', '');
	when.getting('NEW_ENV_VAR', 'default value');
	then.resultShouldBe('');
});

test('Can get true check if environment variable exists', () => {
	given.processEnv('NEW_ENV_VAR', 'value');
	when.checkingIfHas('NEW_ENV_VAR');
	then.resultShouldBe(true);
});

test('Can get false check if environment variable does not exists', () => {
	given.deletedProcessEnv('NEW_ENV_VAR');
	when.checkingIfHas('NEW_ENV_VAR');
	then.resultShouldBe(false);
});

test('Environment variable values are evaluated', () => {
	given.processEnv('NEW_ENV_VAR', 'value');
	given.evaluationPattern('value', 'new value');
	when.getting('NEW_ENV_VAR');
	then.evaluateShouldHaveBeenCalledOnEvaluator();
	then.resultShouldBe('new value');
});

test('.env file is loaded from the application base path by default', () => {
	given.baseDotEnvFile();
	when.gettingAll();
	then.resultShouldMatchProcessEnv();
	then.resultShouldMatchDotEnvFileContent();
});

test('environment file can be loaded manually from a given path', () => {
	given.otherDotEnvFile();
	when.loadingFile();
	when.gettingAll();
	then.resultShouldMatchProcessEnv();
	then.resultShouldMatchOtherDotEnvFileContent();
});
