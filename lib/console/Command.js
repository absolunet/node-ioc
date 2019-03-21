//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const Flag = require('./models/Flag');
const Option = require('./models/Option');
const Parameter = require('./models/Parameter');
const yargs = require('yargs');


class Command {

	/**
	 * Initialize command.
	 */
	init() {
		__(this).set('verbose', 0);
		this.yargs = yargs;
		this.formatArguments();
	}

	/**
	 * Command name accessor.
	 *
	 * @returns string
	 * @throws Error
	 */
	get name() {
		throw new Error('Command name must be implemented.');
	}

	/**
	 * Command description accessor.
	 *
	 * @returns {string}
	 */
	get description() {
		return this.name;
	}

	/**
	 * Command to forward the current command.
	 *
	 * @returns {string|null}
	 */
	get forward() {
		return null;
	}

	/**
	 * Preprocess args before handling the command.
	 *
	 * @param {*} input
	 * @returns {*}
	 */
	preprocess(input) {
		return input;
	}

	/**
	 * Handle the command.
	 *
	 * @returns {Promise<*>|void}
	 */
	handle() { // eslint-disable-line no-empty-function
	}

	/**
	 * Postprocess the handling data.
	 *
	 * @param {*} output
	 * @returns {*}
	 */
	postprocess(output) {
		return output;
	}

	/**
	 * Call an existing command.
	 *
	 * @param {string} command
	 * @param {boolean} [internal]
	 * @returns {*}
	 */
	call(command, internal = true) {
		return this.app.make('command.registrar', {}).resolve(command, internal);
	}

	/**
	 * Forward current command to another command with the exact same arguments.
	 *
	 * @param {string} command
	 * @param {boolean} [internal]
	 * @returns {*}
	 */
	forwardCall(command, internal = true) {
		return this.call(`${command} ${this.terminal.args}`, internal);
	}

	/**
	 * Format arguments from array descriptors to Argument instances.
	 */
	formatArguments() {
		const { argumentModels } = this;
		const args = {};
		__(this).set('arguments', args);
		Object.keys(argumentModels).forEach((type) => {
			const Argument = argumentModels[type];
			args[type] = [];
			this[type].forEach((arg, index) => {
				args[type][index] = this.makeArgument(Argument, arg);
			});
		});
	}

	/**
	 * Create an Argument instance from the given data.
	 *
	 * @param {NewableFunction<Argument>} Argument
	 * @param {Argument|}data
	 * @returns {*}
	 */
	makeArgument(Argument, data) {
		if (data instanceof Argument) {
			return data;
		}

		if (Array.isArray(data)) {
			return new Argument(...data);
		}

		if (typeof data === 'string') {
			return new Argument(data);
		}

		throw new Error(`Cannot create argument with the given data type [${typeof data}].`);
	}

	/**
	 * Signature accessor.
	 *
	 * @returns {string}
	 */
	get signature() {
		const { name, args:{ parameters } } = this;
		const p = parameters.map(({ signature }) => {
			return signature;
		}).join(' ');

		return `${name} ${p}`.replace(/\s\s+/u, ' ').trim();
	}

	/**
	 * Raw parameters accessor.
	 *
	 * @returns {Array[]}
	 */
	get parameters() {
		return [];
	}

	/**
	 * Raw options accessor.
	 *
	 * @returns {Array[]}
	 */
	get options() {
		return [];
	}

	/**
	 * Raw flags accessor.
	 *
	 * @returns {Array[]}
	 */
	get flags() {
		return [];
	}

	/**
	 * Current arguments accessor.
	 *
	 * @returns {*}
	 */
	get args() {
		let args = __(this).get('arguments');
		if (args) {
			return args;
		}

		args = {};
		__(this).set('arguments', args);

		return args;
	}

	/**
	 * Get argument by type and name.
	 * Returns the argument value by default,
	 * but can returns the whole Argument instance.
	 *
	 * @param {string} type
	 * @param {string} name
	 * @param {boolean} [full]
	 * @returns {*|Argument}
	 */
	argument(type, name, full = false) {
		const argument = this.args[type].find(({ name:argumentName }) => {
			return argumentName === name;
		});

		if (!argument) {
			throw new TypeError(`${type} [${name}] does not exists.`);
		}

		return full ? argument : argument.value;
	}

	/**
	 * Get parameter by name.
	 *
	 * @param {string} name
	 * @returns {*|Parameter}
	 */
	parameter(name) {
		return this.argument('parameters', name);
	}

	/**
	 * Get option by name.
	 *
	 * @param {string} name
	 * @returns {*|Option}
	 */
	option(name) {
		return this.argument('options', name);
	}

	/**
	 * Get flag by name.
	 *
	 * @param {string} name
	 * @returns {*|Flag}
	 */
	flag(name) {
		return this.argument('flags', name);
	}

	/**
	 * Print spammy message for developers.
	 *
	 * @param  {...*} args
	 */
	spam(...args) {
		this.print(3, ...args);
	}

	/**
	 * Print debug information.
	 *
	 * @param  {...*} args
	 */
	debug(...args) {
		this.print(2, ...args);
	}

	/**
	 * Print log information.
	 *
	 * @param  {...*} args
	 */
	log(...args) {
		this.print(1, ...args);
	}

	/**
	 * Print information.
	 *
	 * @param  {...*} args
	 */
	info(...args) {
		this.print(0, ...args);
	}

	/**
	 * Print success message.
	 *
	 * @param  {...*} args
	 */
	success(...args) {
		args.forEach((arg) => {
			this.terminal.success(arg);
		});
	}

	/**
	 * Print failure message.
	 *
	 * @param  {...*} args
	 */
	failure(...args) {
		args.forEach((arg) => {
			this.terminal.failure(arg);
		});
	}

	/**
	 * Print information based on the print level and verbose level.
	 *
	 * @param  {...*} args
	 */
	print(level, ...args) {
		if (this.verbose >= level) {
			args.forEach((arg) => {
				this.terminal.println(arg);
			});
		}
	}

	/**
	 * Prompt the user with a question.
	 *
	 * @param {string} question
	 * @param {string|null} [defaultAnswer]
	 */
	ask(question, defaultAnswer = null) {
		return this.terminal.ask(question, defaultAnswer);
	}

	/**
	 * Prompt the user with a question requesting hidden answer.
	 *
	 * @param {string} question
	 * @returns {Promise<string>}
	 */
	secret(question) {
		return this.terminal.secret(question);
	}

	/**
	 * Print a table with list of models.
	 *
	 * @param {string[]} header
	 * @param {{[string]: {string}}[]} data
	 */
	table(header, data) {
		return this.terminal.table(header, data);
	}

	/**
	 * Print multiple tables.
	 *
	 * @param {*[]} tables
	 * @param {boolean} [sideBySide]
	 * @param {*} [options]
	 */
	tables(tables, sideBySide, options = {}) {
		return this.terminal.tables(tables, sideBySide, options);
	}

	/**
	 * Get verbose level, from 0 to 3
	 */
	get verbose() {
		return __(this).get('verbose');
	}

	/**
	 * Yargs instance accessor.
	 *
	 * @returns {yargs}
	 */
	get yargs() {
		return __(this).get('yargs');
	}

	/**
	 * Yargs mutator.
	 *
	 * @param {yargs} y
	 */
	set yargs(y) {
		this.setYargs(y);
	}

	/**
	 * Define the current Yargs instance.
	 *
	 * @param {yargs} y
	 */
	setYargs(y) {
		__(this).set('yargs', y);
	}

	/**
	 * Set the current arguments from the console.
	 * Those arguments should be processed by Yargs first.
	 *
	 * @param {*} argv
	 */
	setArgv(argv) {
		const { args:{ parameters, options, flags } } = this;
		const argsList = [].concat(parameters, options, flags);
		argsList.forEach((argument) => {
			if (Object.prototype.hasOwnProperty.call(argv, argument.name)) {
				argument.value = argv[argument.name];
			}
		});

		__(this).set('verbose', argv.v || (argv.verbose ? 1 : 0));
	}

	/**
	 * Yargs command model accessor.
	 *
	 * @returns {{builder, describe: string, command: string}}
	 */
	get yargsModel() {
		if (this.forward) {
			const model = this.app.make('command').get(this.forward).yargsModel;
			model.command = model.command.replace(this.forward, this.name);

			return model;
		}

		const builder = {};
		const { options, flags } = __(this).get('arguments');
		[].concat(options, flags).forEach((argument) => {
			builder[argument.name] = argument.yargsModel;
		});

		return {
			command: this.signature,
			describe: this.description,
			builder: builder
		};
	}

	/**
	 * Argument models mapping accessor.
	 *
	 * @returns {{options: Option, flags: Flag, parameters: Parameter}}
	 */
	get argumentModels() {
		return {
			parameters: Parameter,
			options: Option,
			flags: Flag
		};
	}

}


module.exports = Command;
