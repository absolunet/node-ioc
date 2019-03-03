//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const yargs = require('yargs');
const Parameter = require('./models/Parameter');
const Option = require('./models/Option');
const Flag = require('./models/Flag');


class Command {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['command.registrar'];
	}

	/**
	 * Command constructor.
	 *
	 * @param {CommandRegistrar} commandRegistrar
	 */
	constructor(commandRegistrar) {
		__(this).set('command.registrar', commandRegistrar);
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
	 * Handle the command.
	 *
	 * @returns {Promise<*>|void}
	 */
	handle() { // eslint-disable-line no-empty-function
	}

	/**
	 * Call an existing command.
	 *
	 * @param {string} command
	 */
	call(command) {
		__(this).get('command.registrar').resolve(command);
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

		throw new Error(`Cannot create argument with the given data type [${typeof data}]`);
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
	}

	/**
	 * Yargs command model accessor.
	 *
	 * @returns {{builder, describe: string, command: string}}
	 */
	get yargsModel() {
		const builder = {};
		const { options, flags } = __(this).get('arguments');
		options.concat(flags).forEach((argument) => {
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
