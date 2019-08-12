//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Model
//--------------------------------------------------------
'use strict';

const path             = require('path');
const GeneratorCommand = require('../../console/GeneratorCommand');


class MakeModelCommand extends GeneratorCommand {

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
		return 'make:model';
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			['all', 'Generate Model, Factory, Migration and Seeder'],
			['factory', 'Generate Factory'],
			['migration', 'Generate Migration'],
			['seeder', 'Generate Seeder']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			base: path.join(__dirname, 'stubs', 'Model.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(process.cwd(), 'database', 'models');
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		const model = this.parameter('class');
		const table = this.app.make('helper.string').plural(model);
		this.debug(`Generating ${model} model`);
		await this.generate('base');
		this.info(`${model} model successfully generated`);

		const all = this.flag('all');

		if (all || this.flag('factory')) {
			await this.call(`make:factory ${model}Factory`);
		}

		if (all || this.flag('migration')) {
			await this.call(`make:migration Create${table}Table`);

		}
		if (all || this.flag('seeder')) {
			await this.call(`make:seeder ${table}TableSeeder`);
		}
	}

}


module.exports = MakeModelCommand;
