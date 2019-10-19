//--------------------------------------------------------
//-- Tests - Unit - Config - Services - Config Grammar - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container     from '../../container';
import ConfigGrammar from '../../../../dist/node/config/services/ConfigGrammar';

let configGrammar;
let result;
let fakeEnvironment;


//-- Mocks
//--------------------------------------------------------

const fakeEnvironmentRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeEnvironment[key] || defaultValue;
	})
};

const fakeEvaluator = {
	evaluate: jest.fn((value) => {
		return value;
	})
};

//-- Given
//--------------------------------------------------------

given.fakeEnvironmentRepository = () => {
	container.singleton('env', fakeEnvironmentRepository);
	fakeEnvironment = {};
};

given.fakeEvaluator = () => {
	container.singleton('evaluator', fakeEvaluator);
};

given.configGrammar = () => {
	configGrammar = container.make(ConfigGrammar);
};

given.basePath = (basePath) => {
	container.useBasePath(basePath);
};

given.homePath = (homePath) => {
	container.useHomePath(homePath);
};

given.environmentVariable = (key, value) => {
	fakeEnvironment[key] = value;
};

given.deletedEnvironmentVariable = (key) => {
	delete fakeEnvironment[key];
};


//-- When
//--------------------------------------------------------

when.calling = (method, parameters) => {
	when.attempting(() => {
		result = configGrammar[method](...parameters);
	});
};

when.formatting = (...parameters) => {
	when.calling('format', parameters);
};

when.formattingPath = (...parameters) => {
	when.calling('formatPath', parameters);
};

when.formattingEnvironment = (...parameters) => {
	when.calling('formatEnvironment', parameters);
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};


export default build({ given, when, then });
