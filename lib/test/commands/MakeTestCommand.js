//--------------------------------------------------------
//-- Node IoC - Test - Command - Make Test
//--------------------------------------------------------
'use strict';

const GeneratorCommand = require('../../console/GeneratorCommand');


class MakeTestCommand extends GeneratorCommand {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['test.type', 'helper.path', 'helper.string']);
	}

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['env:local'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'make:test';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		const types = this.testTypes.map((name) => {
			const className = `${name[0].toUpperCase()}${name.substr(1)}Test`;

			return { [name]: this.app.formatPath(__dirname, 'stubs', `${className}.stub`) };
		});

		return Object.assign({}, ...types);
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return this.app.testPath(this.testTypeName, this.getNamespace());
	}

	/**
	 * {@inheritdoc}
	 */
	get options() {
		return super.options.concat([
			['type', '', 'Indicates the test type'],
			['for', '', 'Indicates the file or the class the test is intended for']
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return this.testTypes.map((type) => {
			return [type, `Create ${type} test`];
		});
	}

	/**
	 * {@inheritdoc}
	 */
	get patterns() {
		return {
			TEST_CASE_PATH: this.app.formatPath(this.pathHelper.relative(this.pathHelper.dirname(this.getDestination()), this.app.testPath('TestCase.js')))
		};
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		const type = this.testTypeName;
		this.debug(`Generating ${this.stringHelper.lower(type)} test`);
		await this.generate(type);
		this.info(`${this.stringHelper.pascal(type)} test ${this.parameter('class')} successfully generated`);
	}

	/**
	 * @retusn {string}
	 */
	getNamespace() {
		return this.option('for') || '';
	}

	/**
	 * Get the test type.
	 *
	 * @returns {string}
	 */
	get testTypeName() {
		for (const value of this.testTypes) {
			if (this.flag(value)) {
				return value;
			}
		}

		const type = this.option('type');

		return this.testTypes.includes(type) ? type : this.defaultType;
	}

	/**
	 * Get available test types.
	 *
	 * @type {Array<string>}
	 */
	get testTypes() {
		return this.testType.values();
	}

	/**
	 * Default type accessor.
	 *
	 * @returns {string}
	 */
	get defaultType() {
		return this.testType.UNIT;
	}

	/**
	 * @type {StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

	/**
	 * @type {PathHelper}
	 */
	get pathHelper() {
		return this.helperPath;
	}

}


module.exports = MakeTestCommand;
