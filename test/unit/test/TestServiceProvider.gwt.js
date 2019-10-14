//--------------------------------------------------------
//-- Tests - Unit - Test - Test Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container      = require('../container');
const TestRepository = require('../../../src/test/repositories/TestRepository');


//-- Then
//--------------------------------------------------------

then.testRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test');
};

then.testRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('test');
};

then.unitTestRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.unit');
};

then.unitTestRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.unit');
};

then.featureTestRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.feature');
};

then.featureTestRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.feature');
};

then.standardsTestRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.standards');
};

then.standardsTestRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.standards');
};

then.endToEndTestRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.e2e');
};

then.endToEndRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.e2e');
};

then.testRunnerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.runner');
};

then.testRunnerShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.runner');
};

then.testServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('tester');
};

then.testServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('tester');
};

then.testTypeEnumShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.type');
};

then.testTypeEnumShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.type');
};

then.jestTestEngineShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('test.engine.jest');
};

then.jestTestEngineShouldBeSingleton = () => {
	then.shouldHaveSingleton('test.engine.jest');
};

then.testRepositoriesShouldHaveSameTag = () => {
	expect(container.isTag('tests')).toBe(true);
	const tests = container.make('tests');
	expect(Object.keys(tests)).toHaveLength(4);
	const allAreTestRepositories = Object.values(tests).every((testRepository) => {
		return testRepository instanceof TestRepository;
	});
	expect(allAreTestRepositories).toBe(true);
};


module.exports = build({ given, when, then });
