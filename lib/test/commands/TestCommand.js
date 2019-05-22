//--------------------------------------------------------
//-- Node IoC - Test - Command - Test
//--------------------------------------------------------
'use strict';


const Command = require('./../../console/Command');
const { UNIT, FEATURE, STANDARDS, E2E, ALL = 'all', NULL = '' } = require('./../enums/Type');

const TYPES = [UNIT, FEATURE, STANDARDS, E2E];

const REPOSITORIES = {
	[NULL]: 'test',
	[ALL]: 'test',
	[UNIT]: 'test.unit',
	[FEATURE]: 'test.feature',
	[STANDARDS]: 'test.standards',
	[E2E]: 'test.e2e'
};


class TestCommand extends Command {

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
			['type', null, 'Type of test to run']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			[UNIT, 'Run unit tests'],
			[FEATURE, 'Run feature tests'],
			[STANDARDS, 'Run code and structure standards tests'],
			[E2E, 'Run end-to-end tests']
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

		const engine = this.getEngine();
		const engineArguments = engine.getPathArgument(this.getRepositoryName());

		return this.run(`${engine.path} ${engineArguments} --coverage --coverageReporters=json`);
	}

	/**
	 * Resolve repository name based on input.
	 *
	 * @returns {TestRepository}
	 */
	getRepositoryName() {
		let type = this.option('type');

		if (type && !['all', ...TYPES].includes(type)) {
			throw new TypeError(`You must run a valid test type in [${TYPES.join(',')}]`);
		}

		if (!type) {
			type = TYPES.find((flag) => { return this.flag(flag); }) || ALL;
		}

		return REPOSITORIES[type];
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
	 * @returns {}
	 */
	getEngine() {
		return this.app.make(`test.engine.${this.getEngineName()}`)
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

}

module.exports = TestCommand;
