//--------------------------------------------------------
//-- Node IoC - Test - Command - Make Test
//--------------------------------------------------------
'use strict';

const path = require('path');
const TypeEnum = require('../enums/Type');

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
	get files() {
		return Object.assign(...Object.values(TypeEnum).map((name) => {
			const className = `${name[0].toUpperCase()}${name.substr(1)}Test`;

			return { [name]: path.join(__dirname, 'stubs', `${className}.stub`) };
		}));
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(process.cwd(), 'test', this.getType(), this.getNamespace());
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
		return Object.values(TypeEnum).map((type) => {
			return [type, `Create ${type} test`];
		});
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		const type = this.getType();
		this.debug(`Generating ${type} test`);
		await this.generate(type);
		this.info(`${type[0].toUpperCase()}${type.substr(1)} test ${this.parameter('class')} successfully generated`);
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
	getType() {
		for (const value of Object.values(TypeEnum)) {
			if (this.flag(value)) {
				return value;
			}
		}

		const type = this.option('type');

		return Object.values(TypeEnum).includes(type) ? type : this.defaultType;
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
