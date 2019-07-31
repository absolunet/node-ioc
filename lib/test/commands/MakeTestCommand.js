//--------------------------------------------------------
//-- Node IoC - Test - Command - Make Test
//--------------------------------------------------------
'use strict';

const path             = require('path');
const TypeEnum         = require('../enums/Type');
const GeneratorCommand = require('../../console/GeneratorCommand');


class MakeTestCommand extends GeneratorCommand {

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
	get description() {
		return 'Create a test class';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		const types = this.testTypes.map((name) => {
			const className = `${name[0].toUpperCase()}${name.substr(1)}Test`;

			return { [name]: path.join(__dirname, 'stubs', `${className}.stub`) };
		});

		return Object.assign({}, ...types);
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(process.cwd(), 'test', this.testType, this.getNamespace());
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
	handle() {
		const { testType } = this;
		this.debug(`Generating ${testType} test`);
		this.generate(testType);
		this.info(`${testType[0].toUpperCase()}${testType.substr(1)} test ${this.parameter('class')} successfully generated`);
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
	get testType() {
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
		return Object.entries(Object.getOwnPropertyDescriptors(TypeEnum))
			.filter(([, descriptor]) => {
				return Object.prototype.hasOwnProperty.call(descriptor, 'get');
			})
			.map(([name]) => {
				return TypeEnum[name];
			});
	}

	/**
	 * Default type accessor.
	 *
	 * @returns {string}
	 */
	get defaultType() {
		return TypeEnum.UNIT;
	}

}


module.exports = MakeTestCommand;
