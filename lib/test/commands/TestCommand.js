//--------------------------------------------------------
//-- Node IoC - Test - Command - Test
//--------------------------------------------------------
'use strict';

const Command = require('../../console/Command');


class TestCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['test.type']);
	}

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['public'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'test';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Test the application';
	}

	/**
	 * {@inheritdoc}
	 */
	get options() {
		return [
			['engine', 'jest', 'Test engine to work with'],
			['type',   null,   'Type of test to run']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			[this.testType.UNIT,      'Run unit tests'],
			[this.testType.FEATURE,   'Run feature tests'],
			[this.testType.STANDARDS, 'Run code and structure standards tests'],
			[this.testType.E2E,       'Run end-to-end tests']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		return this.runTestEngine();
	}

	/**
	 * Run test engine on the requested test classes.
	 *
	 * @returns {Promise}
	 */
	runTestEngine() {
		this.storeRepositoryName(this.getRepositoryName());
		this.storeEngineName(this.getEngineName());
		this.formatArgv();

		const engine          = this.getEngine();
		const engineArguments = engine.getPathArgument(this.getRepositoryName());

		return this.run(`${engine.path} ${engineArguments}`);
	}

	/**
	 * Resolve repository name based on input.
	 *
	 * @returns {string}
	 */
	getRepositoryName() {
		let type    = this.option('type');
		const types = this.testType.values();

		if (type && !['all', ...types].includes(type)) {
			throw new TypeError(`You must run a valid test type in [${types.join(',')}]`);
		}

		if (!type) {
			type = types.find((flag) => { return this.flag(flag); }) || this.testType.ALL;
		}

		return this.repositories[type];
	}

	/**
	 * Store repository name in current process environment.
	 *
	 * @param {string} repositoryName
	 * @returns {TestCommand}
	 */
	storeRepositoryName(repositoryName) {
		process.env.TEST_REPOSITORY = repositoryName;

		return this;
	}

	/**
	 * Resolve engine name based on input.
	 *
	 * @returns {string}
	 */
	getEngineName() {
		return this.option('engine');
	}

	/**
	 * Get engine implementation from application.
	 *
	 * @returns {*}
	 */
	getEngine() {
		return this.app.make(`test.engine.${this.getEngineName()}`);
	}

	/**
	 * Store engine name in the current process environment variables.
	 *
	 * @param {string} engineName
	 * @returns {TestCommand}
	 */
	storeEngineName(engineName) {
		process.env.TEST_ENGINE = engineName;

		return this;
	}

	/**
	 * Format current arguments to fit the engine CLI argument model.
	 *
	 * @returns {TestCommand}
	 */
	formatArgv() {
		const { argv } = process;

		process.env.TEST_ARGV = JSON.stringify(argv);
		process.argv = argv.slice(0, argv.indexOf(this.name) + 1);

		return this;
	}

	/**
	 * @type {Object<string, string>}
	 */
	get repositories() {
		return {
			'':                        'test',
			'all':                     'test',
			[this.testType.UNIT]:      'test.unit',
			[this.testType.FEATURE]:   'test.feature',
			[this.testType.STANDARDS]: 'test.standards',
			[this.testType.E2E]:       'test.e2e'
		};
	}

}

module.exports = TestCommand;
