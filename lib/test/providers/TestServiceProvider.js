//--------------------------------------------------------
//-- Node IoC - Test - Test Service Provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider    = require('./ConsoleServiceProvider');
const ServiceProvider           = require('./../../foundation/ServiceProvider');
const TestRepository            = require('./../repositories/TestRepository');
const UnitTestRepository        = require('./../repositories/UnitTestRepository');
const FeatureTestRepository     = require('./../repositories/FeatureTestRepository');
const StandardsTestRepository   = require('./../repositories/StandardsTestRepository');
const EndToEndTestRepository    = require('./../repositories/EndToEndTestRepository');
const TestRunner                = require('./../services/TestRunner');
const Tester                    = require('./../services/Tester');
const AvaEngine                 = require('./../engines/AvaEngine');
const JestEngine                = require('./../engines/JestEngine');


class TestServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.register(ConsoleServiceProvider);
		this.app.configurePaths({ test: `${this.app.make('path.base')}/test`});

		this.registerRepositories();
		this.registerServices();
		this.registerEngines();
	}

	/**
	 * Register all the test repositories in the container.
	 */
	registerRepositories() {
		this.app.singleton('test', TestRepository);
		this.app.singleton('test.unit', UnitTestRepository);
		this.app.singleton('test.feature', FeatureTestRepository);
		this.app.singleton('test.standards', StandardsTestRepository);
		this.app.singleton('test.e2e', EndToEndTestRepository);
		this.app.tag(['test.unit', 'test.feature', 'test.standards', 'test.e2e'], 'tests');
	}

	/**
	 * Register test services in the container.
	 */
	registerServices() {
		this.app.singleton('test.runner', TestRunner);
		this.app.singleton('tester', Tester);
	}

	/**
	 * Register all the supported engines in the container.
	 */
	registerEngines() {
		this.app.singleton('test.engine.ava', AvaEngine);
		this.app.singleton('test.engine.jest', JestEngine);
	}

}


module.exports = TestServiceProvider;
