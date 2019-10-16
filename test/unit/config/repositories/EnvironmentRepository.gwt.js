//--------------------------------------------------------
//-- Tests - Unit - Config - Repositories - Environment Repository - GWT
//--------------------------------------------------------
'use strict';

/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-process-env */

const { given, when, then, build } = require('../common.gwt');

const path                  = require('path');
const container             = require('../../container');
const EnvironmentRepository = require('../../../../dist/node/config/repositories/EnvironmentRepository');

const originalProcessEnv = process.env;
const baseDotEnvFile     = path.join(__dirname, '..', 'stubs', '.env');
const otherDotEnvFile    = path.join(__dirname, '..', 'stubs', 'other.env');

let environmentRepository;
let dotEnvFile;
let result;
let fakeProcessEnv;
let fakeEvaluationPattern;


//-- Mocks
//--------------------------------------------------------

const fakeEvaluator = {
	evaluate: jest.fn((value) => {
		return fakeEvaluationPattern[value] || value;
	})
};


//-- Given
//--------------------------------------------------------

given.fakeProcessEnv = () => {
	fakeProcessEnv = { ...originalProcessEnv };
	process.env    = fakeProcessEnv;
};

given.fakeEvaluator = () => {
	container.singleton('evaluator', fakeEvaluator);
	fakeEvaluationPattern = {};
};

given.environmentRepository = () => {
	environmentRepository = container.make(EnvironmentRepository);
};

given.processEnv = (key, value) => {
	process.env[key] = value;
};

given.deletedProcessEnv = (key) => {
	delete process.env[key];
};

given.evaluationPattern = (key, value) => {
	fakeEvaluationPattern[key] = value;
};

given.stubsBasePath = () => {
	container.useBasePath(path.join(__dirname, '..', 'stubs'));
};

given.dotEnvFile = (file) => {
	dotEnvFile = file;
};

given.baseDotEnvFile = () => {
	given.dotEnvFile(baseDotEnvFile);
};

given.otherDotEnvFile = () => {
	given.dotEnvFile(otherDotEnvFile);
};


//-- When
//--------------------------------------------------------

when.gettingAll = () => {
	when.attempting(() => {
		result = environmentRepository.all();
	});
};

when.modifyingResult = () => {
	when.attempting(() => {
		result.foo = 'bar';
	});
};

when.getting = (key, defaultValue) => {
	when.attempting(() => {
		result = environmentRepository.get(key, defaultValue);
	});
};

when.checkingIfHas = (key) => {
	when.attempting(() => {
		result = environmentRepository.has(key);
	});
};

when.loadingFile = () => {
	when.attempting(() => {
		environmentRepository.setFromFile(dotEnvFile);
	});
};


//-- Then
//--------------------------------------------------------

then.resetProcessEnv = () => {
	process.env = originalProcessEnv;
};

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldNotBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).not.toBe(expected);
};

then.resultShouldMatch = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toMatchObject(expected);
};

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.resultShouldNotEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).not.toStrictEqual(expected);
};

then.resultShouldEqualProcessEnv = () => {
	then.resultShouldEqual(fakeProcessEnv);
};

then.resultShouldNotBeAllFromRepository = () => {
	then.resultShouldNotBe(environmentRepository.all());
};

then.resultShouldNotEqualAllFromRepository = () => {
	then.resultShouldNotEqual(environmentRepository.all());
};

then.evaluateShouldHaveBeenCalledOnEvaluator = () => {
	then.shouldNotHaveThrown();
	expect(fakeEvaluator.evaluate).toHaveBeenCalled();
	expect(fakeEvaluator.evaluate).toHaveReturnedWith(result);
};

then.resultShouldMatchProcessEnv = () => {
	then.resultShouldMatch(fakeProcessEnv);
};

then.resultShouldMatchDotEnvFileContent = () => {
	then.resultShouldMatch({ APP_ENV: 'test', APP_FILE: 'base' });
};

then.resultShouldMatchOtherDotEnvFileContent = () => {
	then.resultShouldMatch({ APP_ENV: 'test', APP_FILE: 'other' });
};


module.exports = build({ given, when, then });

/* eslint-enable unicorn/prevent-abbreviations */
/* eslint-enable no-process-env */
