//--------------------------------------------------------
//-- Node IoC - Database - Command - Make Migration
//--------------------------------------------------------
'use strict';

const path = require('path');
const GeneratorCommand = require('../../console/GeneratorCommand');


class MakeMigrationCommand extends GeneratorCommand {

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
		return 'make:migration';
	}

	/**
	 * {@inheritdoc}
	 */
	get files() {
		return {
			'create': path.join(__dirname, 'stubs', 'MigrationCreate.stub'),
			'alter':  path.join(__dirname, 'stubs', 'MigrationAlter.stub'),
			'drop':   path.join(__dirname, 'stubs', 'MigrationDrop.stub'),
			'delete': path.join(__dirname, 'stubs', 'MigrationDrop.stub')
		};
	}

	/**
	 * {@inheritdoc}
	 */
	get destination() {
		return path.join(process.cwd(), 'database', 'migrations');
	}

	/**
	 * {@inheritdoc}
	 */
	get filename() {
		const now = new Date();
		const prefix = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds']
			.reduce((result, type) => {
				const value = `${now[`get${type}`]() + Number(type === 'Month')}`;

				return `${result}${value.length > 1 ? value : `0${value}`}`;
			}, '');

		return `${prefix}_${this.parameter('class')}.js`;
	}

	/**
	 * {@inheritdoc}
	 */
	get patterns() {
		return {
			TABLE: this.getTableName()
		};
	}

	/**
	 * {@inheritdoc}
	 */
	async handle() {
		this.debug(`Generating ${this.parameter('class')} migration`);
		await this.generate(this.getAction());
		this.info(`${this.parameter('class')} migration successfully generated`);
	}

	/**
	 * Get guessed table name based on the class name.
	 *
	 * @returns {string}
	 */
	getTableName() {
		const table = ((/.+(?<table>[A-Z][a-zA-Z]+)Table$/u).exec(this.parameter('class')) || { groups: {} }).groups.table || 'Table';

		return this.app.make('helper.string').slug(table);
	}

	/**
	 * Get guessed action based on the class name.
	 *
	 * @returns {string}
	 */
	getAction() {
		const { action = 'Create' } =  ((/^(?<action>[A-Z][a-z]+)/u).exec(this.parameter('class')) || { groups: {} }).groups;

		const supported = Object.keys(this.files);
		const slug = this.app.make('helper.string').slug(action);

		return supported.includes(slug) ? slug : supported[0];
	}

}


module.exports = MakeMigrationCommand;
