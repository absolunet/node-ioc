//--------------------------------------------------------
//-- Node IoC - Test - Service - Tester
//--------------------------------------------------------
'use strict';


const __				  = require('@absolunet/private-registry');
const hasEngine 		  = require('./../../support/mixins/hasEngine');


class Tester extends hasEngine() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Boot the tester, create a fresh application instance and prepare main setup.
	 *
	 * @param {ServiceProvider[]} providers
	 * @returns {Tester}
	 */
	boot(providers = []) {
		this.setKernel(this.app.make('kernel.console'));

		const setUp = global.beforeEach || this.engine.beforeEach;
		setUp(() => {
			this.createFreshApplication(providers);
		});

		this.createFreshApplication(providers);

		return this;
	}

	/**
	 * Run tests from a given repository abstract name.
	 *
	 * @param {string} repositoryName
	 */
	run(repositoryName = 'test') {
		this.app.environment = 'test';

		const repository = this.app.make(repositoryName);

		this.runner.run(repository.all());
	}

	/**
	 * Set current test engine.
	 * Set runner test engine as well.
	 *
	 * @param {string} engineName
	 * @returns {Tester}
	 */
	setEngine(engineName) {
		let engine = engineName;

		if (typeof engine === 'string') {
			({ engine } = this.app.make(`test.engine.${engineName}`));
		}

		super.setEngine(engine);
		this.runner.setEngine(engine);

		return this;
	}

	/**
	 * Create a fresh application by flushing all existing bindings.
	 * Bind new providers and boot the application afterward.
	 *
	 * @param {ServiceProvider[]} providers
	 */
	createFreshApplication(providers = []) {
		const { kernel } = this;
		this.app.flush();
		this.app.setContext(module);
		this.app.environment = 'test';
		this.app.make(kernel);
		providers.forEach((provider) => {
			this.app.register(provider);
		});
		this.app.bootIfNotBooted();
	}

	/**
	 * Set test runner instance.
	 * It allows the tester to keep a singleton even if the application is flushed after every test.
	 *
	 * @param {TestRunner} runner
	 * @returns {Tester}
	 */
	setRunner(runner) {
		__(this).set('test.runner', runner);

		return this;
	}

	/**
	 * Set the application kernel.
	 * It allows the tester to keep a singleton even if the application is flushed after every test.
	 *
	 * @param {Kernel} kernel
	 * @returns {Tester}
	 */
	setKernel(kernel) {
		__(this).set('kernel', kernel.constructor);

		return this;
	}

	/**
	 * Test runner accessor.
	 *
	 * @returns {TestRunner}
	 */
	get runner() {
		const name = 'test.runner';
		const runner = __(this).get(name);

		if (!runner) {
			return this.setRunner(this.app.make(name));
		}

		return runner;
	}

	/**
	 * Current kernel accessor.
	 *
	 * @returns {Kernel}
	 */
	get kernel() {
		return __(this).get('kernel');
	}

}

module.exports = Tester;
