//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';

const { spawn } 	= require('child_process');
const yargs 		= require('yargs');
const __    		= require('@absolunet/private-registry');

const Flag      	= require('./models/Flag');
const Option    	= require('./models/Option');
const Parameter 	= require('./models/Parameter');


class Command {

	/**
	 * Initialize command.
	 */
	init() {
		__(this).set('verbose', 0);
		this.yargs = yargs;
		this.formatArguments();
		this.initOutputInterceptor();
	}

	/**
	 * Specify policies of the command.
	 */
	get policies() {
		return ['private'];
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
	handle() {
		//
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
	 * Run node script in a new spawn shell.
	 *
	 * @param {string} command
	 * @param {*} [options]
	 * @return {Promise}
	 */
	run(command, options = {}) {
		return this.spawn(process.argv[0], command, options);
	}

	/**
	 * Run script in a new spawn shell.
	 *
	 * @param {string} binary
	 * @param {string} command
	 * @param {*} [options]
	 * @returns {Promise}
	 */
	spawn(binary, command, options = {}) {
		return new Promise((resolve, reject) => {
			const spawnOptions = Object.assign({ stdio: 'inherit' }, options);

			spawn(binary, command.split(' '), spawnOptions)
				.on('close', (code) => {
					if (code === 0) {
						resolve();
					} else {
						reject(code);
					}
				});
		});
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
		const parameters = {};
		__(this).set('arguments', parameters);
		Object.keys(argumentModels).forEach((type) => {
			const Argument = argumentModels[type];
			parameters[type] = [];
			this[type].forEach((parameter, index) => {
				parameters[type][index] = this.makeArgument(Argument, parameter);
			});
		});
	}

	/**
	 * Create an Argument instance from the given data.
	 *
	 * @param {Function<Argument>} Argument
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
		const { name, args: { parameters } } = this;
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
	// eslint-disable-next-line unicorn/prevent-abbreviations
	get args() {
		let parameters = __(this).get('arguments');
		if (parameters) {
			return parameters;
		}

		parameters = {};
		__(this).set('arguments', parameters);

		return parameters;
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
		const argument = this.args[type].find(({ name: argumentName }) => {
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
	 * @param  {...*} parameters
	 */
	spam(...parameters) {
		this.print(3, ...parameters);
	}

	/**
	 * Print debug information.
	 *
	 * @param  {...*} parameters
	 */
	debug(...parameters) {
		this.print(2, ...parameters);
	}

	/**
	 * Print log information.
	 *
	 * @param  {...*} parameters
	 */
	log(...parameters) {
		this.print(1, ...parameters);
	}

	/**
	 * Print information.
	 *
	 * @param  {...*} args
	 */
	info(...parameters) {
		this.print(0, ...parameters);
	}

	/**
	 * Print success message.
	 *
	 * @param  {...*} parameters
	 */
	success(...parameters) {
		parameters.forEach((parameter) => {
			this.terminal.success(parameter);
		});
	}

	/**
	 * Print failure message.
	 *
	 * @param  {...*} parameters
	 */
	failure(...parameters) {
		parameters.forEach((parameter) => {
			this.terminal.failure(parameter);
		});
	}

	/**
	 * Print information based on the print level and verbose level.
	 *
	 * @param {number} level
	 * @param  {...*} parameters
	 */
	print(level, ...parameters) {
		if (this.verbose >= level) {
			parameters.forEach((parameter) => {
				this.terminal.println(parameter);
			});
		}
	}

	/**
	 * Prompt the user with a question.
	 *
	 * @param {string} question
	 * @param {string|null} [defaultAnswer]
	 * @returns {Promise<string>}
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
	 * Prompt the user with a confirmation statement requesting a yes/no answer.
	 *
	 * @param {string} statement
	 * @param {boolean} [defaultValue]
	 * @returns {Promise<boolean>}
	 */
	confirm(statement, defaultValue = false) {
		return this.terminal.confirm(statement, defaultValue);
	}

	/**
	 * Prompt the user with a question having a list of available choices.
	 *
	 * @param {string} question
	 * @param {string[]|*} choices
	 * @param {string} [defaultValue]
	 * @returns {Promise<string>}
	 */
	choice(question, choices, defaultValue) {
		return this.terminal.choice(question, choices, defaultValue);
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
	 * Initialize the output interceptor callback for the terminal interceptor.
	 * Doesn't enable the interceptor.
	 */
	initOutputInterceptor() {
		const capturedOutput = 'capturedOutput';
		__(this).set(capturedOutput, '');
		__(this).set('outputInterceptor', (output) => {
			__(this).set(capturedOutput, `${__(this).get(capturedOutput)}\n${output}`);
		});
	}

	/**
	 * Initialize the output capturing phase with the default output interceptor.
	 *
	 * @returns {Command}
	 */
	captureOutput() {
		this.interceptor.mute().removeStyle().add(this.outputInterceptor);

		return this;
	}

	/**
	 * Stop the output capture by the default interceptor.
	 *
	 * @returns {Command}
	 */
	stopCaptureOutput() {
		this.interceptor.remove(this.outputInterceptor).keepStyle().unmute();

		return this;
	}

	/**
	 * Get the captured output.
	 *
	 * @param {boolean} [stopCapture]
	 * @returns {string}
	 */
	getCapturedOutput(stopCapture = true) {
		if (stopCapture) {
			this.stopCaptureOutput();
		}

		return __(this).get('capturedOutput');
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
		const { args: { parameters, options, flags } } = this;
		const list = [].concat(parameters, options, flags);
		list.forEach((argument) => {
			if (Object.prototype.hasOwnProperty.call(argv, argument.name)) {
				argument.value = argv[argument.name];
			}
		});

		__(this).set('verbose', argv.v || (argv.verbose ? 1 : 0));
	}

	/**
	 * Yargs command model accessor.
	 *
	 * @type {{builder, describe: string, command: string}}
	 */
	get yargsModel() {
		if (this.forward) {
			const model = this.app.make('command').get(this.forward).yargsModel;
			model.command = model.command.replace(this.forward, this.name);

			return model;
		}

		const builder = {};
		const { options, flags } = __(this).get('arguments');
		[...options, ...flags].forEach((argument) => {
			builder[argument.name] = argument.yargsModel;
		});

		return {
			command:  this.signature,
			describe: this.description,
			builder:  builder
		};
	}

	/**
	 * Argument models mapping accessor.
	 *
	 * @type {{options: Option, flags: Flag, parameters: Parameter}}
	 */
	get argumentModels() {
		return {
			parameters: Parameter,
			options:    Option,
			flags:      Flag
		};
	}

	/**
	 * Output interceptor function.
	 *
	 * @type {Function}
	 */
	get outputInterceptor() {
		return __(this).get('outputInterceptor');
	}

	/**
	 * @type {Interceptor}
	 */
	get interceptor() {
		return this.app.make('terminal.interceptor');
	}

}


module.exports = Command;
