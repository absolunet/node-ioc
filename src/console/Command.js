//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------

import __                  from '@absolunet/private-registry';
import NotImplementedError from '../foundation/exceptions/NotImplementedError';
import Flag                from './models/Flag';
import Option              from './models/Option';
import Parameter           from './models/Parameter';


/**
 * Abstract command class.
 * It allows to properly create a valid command into the command registrar.
 *
 * @memberof console
 * @abstract
 * @hideconstructor
 */
class Command {

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('verbose', 0);
		this.formatArguments();
		this.initOutputInterceptor();
	}

	/**
	 * Specify policies for the command.
	 *
	 * @type {Array<string>}
	 */
	get policies() {
		return ['public'];
	}

	/**
	 * Command name accessor.
	 *
	 * @type {string}
	 * @abstract
	 */
	get name() {
		throw new NotImplementedError(this, 'name', 'string', 'accessor');
	}

	/**
	 * Command description accessor.
	 *
	 * @type {string}
	 * @abstract
	 */
	get description() {
		return this.name;
	}

	/**
	 * Command to forward the current command.
	 *
	 * @type {string|null}
	 */
	get forward() {
		return null;
	}

	/**
	 * Preprocess args before handling the command.
	 *
	 * @param {object<string, string>} input - The user input.
	 * @returns {Promise<object<string, string>>|object<string, string>} A preprocessed input.
	 */
	preprocess(input) {
		return input;
	}

	/**
	 * Handle the command.
	 * If it returns a value, it will be send to the postprocess method.
	 *
	 * @returns {void|Promise} The async process promise.
	 * @abstract
	 */
	handle() {
		//
	}

	// eslint-disable-next-line jsdoc/require-returns-check
	/**
	 * Postprocess the handled data.
	 *
	 * @param {*} [output] - The output of the handled data.
	 * @returns {Promise|void} The async process promise.
	 * @async
	 */
	postprocess(output) { // eslint-disable-line no-unused-vars
		//
	}

	/**
	 * Run node script in a new spawn shell.
	 *
	 * @param {string} command - The command to run.
	 * @param {*} [options] - The spawn options.
	 * @returns {Promise} The async process promise.
	 */
	run(command, options = {}) {
		return this.spawn(process.argv[0], command, options);
	}

	/**
	 * Run script in a new spawn shell.
	 *
	 * @param {string} command - The binary that will execute the command.
	 * @param {Array<string>|string} [parameters=''] - The command.
	 * @param {*} [options] - The spawn options.
	 * @returns {Promise} The async process promise.
	 */
	async spawn(command, parameters = '', options = {}) {
		await this.terminal.spawn(command, Array.isArray(parameters) ? parameters : parameters.split(' '), Object.assign({ stdio: 'inherit' }, options));
	}

	/**
	 * Call an existing command.
	 *
	 * @param {string} command - Command to call.
	 * @param {boolean} [internal] - Specify if the command should be processed as an internal process. If if should check the policies restrictions, set to false.
	 * @returns {Promise} The async process promise.
	 */
	call(command, internal = true) {
		return this.app.make('command.registrar').resolve(command, internal);
	}

	/**
	 * Forward current command to another command with the exact same arguments.
	 *
	 * @param {string} command - The command name that should be used instead of handling command.
	 * @param {boolean} [internal] - Specify if the command should be processed as an internal process. If if should check the policies restrictions, set to false.
	 * @returns {Promise} The async process promise.
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
			parameters[type] = this[type].map((parameter) => {
				return this.makeArgument(Argument, parameter);
			});
		});
	}

	/**
	 * Create an Argument instance from the given data.
	 *
	 * @param {Function} Argument - The argument class to use, either a Parameter, an Option or a Flag.
	 * @param {console.models.Argument|Array<*>|string} data - The data to make as an argument.
	 * @returns {console.models.Argument} The made argument instance.
	 * @throws {TypeError} Indicates that the given data was invalid.
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

		throw new TypeError(`Cannot create argument with the given data type [${typeof data}].`);
	}

	/**
	 * Yargs signature accessor.
	 *
	 * @type {string}
	 */
	get signature() {
		const { name, args: { parameters } } = this;
		const p = parameters.map(({ signature }) => {
			return signature;
		}).join(' ');

		return `${name} ${p}`.replace(/\s{2,}/u, ' ').trim();
	}

	/**
	 * Raw parameters accessor.
	 * A parameter is normally located after the command name in a CLI input: "node ioc foo:bar parameter --option=value --flag".
	 *
	 * @example
	 * [
	 * 		['name',   true,  null,   'The required name.'],
	 * 		['prefix', false, '',     'The optional prefix.'],
	 * 		['suffix', false, '-foo', 'The optional suffix, which is set to "-foo" by default.']
	 * ]
	 *
	 * @type {Array<Array<string|boolean|null>>}
	 */
	get parameters() {
		return [];
	}

	/**
	 * Raw options accessor.
	 * An option is normally located after the command parameters in a CLI input: "node ioc foo:bar parameter --option=value --flag".
	 *
	 * @example
	 * [
	 * 		['foo', null,  'The foo option'],
	 * 		['bar', 'baz', 'The bar option, which is set to "baz" by default.']
	 * ]
	 *
	 * @type {Array<Array<string|boolean|null>>}
	 */
	get options() {
		return [];
	}

	/**
	 * Raw flags accessor.
	 * A flag is normally located after the command options in a CLI input: "node ioc foo:bar parameter --option=value --flag".
	 *
	 * @example
	 * [
	 * 		['foo', 'Some flag'],
	 * 		['bar', 'Some other flag']
	 * ]
	 *
	 * @type {Array<Array<string>>}
	 */
	get flags() {
		return [];
	}

	/**
	 * Current arguments accessor.
	 *
	 * @type {object}
	 */
	get args() { // eslint-disable-line unicorn/prevent-abbreviations
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
	 * @param {string} type - The argument type.
	 * @param {string} name - The argument name.
	 * @param {boolean} [full] - Indicates if a full argument should be returned instead of the value only.
	 * @returns {*|Argument} Either the argument value or the Argument instance.
	 */
	argument(type, name, full = false) {
		const argument = this.args[type].find(({ name: argumentName }) => {
			return argumentName === name;
		});

		if (!argument) {
			throw new TypeError(`${type} [${name}] does not exists.`);
		}

		return full ? argument : argument.value || argument.defaultValue;
	}

	/**
	 * Check if argument is supported by type and name.
	 *
	 * @param {string} type - The argument type.
	 * @param {string} name - The argument name.
	 * @returns {boolean} The argument support in the current command.
	 */
	argumentIsSupported(type, name) {
		return this.args[type].some(({ name: argumentName }) => {
			return argumentName === name;
		});
	}

	/**
	 * Get parameter by name.
	 *
	 * @param {string} name - The parameter name.
	 * @returns {string} The parameter value.
	 */
	parameter(name) {
		return this.argument('parameters', name);
	}

	/**
	 * Check if parameter is supported by name.
	 *
	 * @param {string} name - The parameter name.
	 * @returns {boolean} The parameter support in the current command.
	 */
	parameterIsSupported(name) {
		return this.argumentIsSupported('parameters', name);
	}

	/**
	 * Get option by name.
	 *
	 * @param {string} name - The option name.
	 * @returns {string|null} The option value.
	 */
	option(name) {
		return this.argument('options', name);
	}

	/**
	 * Check if option is supported by name.
	 *
	 * @param {string} name - The option name.
	 * @returns {boolean} The option support in the current command.
	 */
	optionIsSupported(name) {
		return this.argumentIsSupported('options', name);
	}

	/**
	 * Get flag by name.
	 *
	 * @param {string} name - The flag name.
	 * @returns {boolean} The flag value.
	 */
	flag(name) {
		return this.argument('flags', name);
	}

	/**
	 * Check if flag is supported by name.
	 *
	 * @param {string} name - The flag name.
	 * @returns {boolean} The flag support in the current command.
	 */
	flagIsSupported(name) {
		return this.argumentIsSupported('flags', name);
	}

	/**
	 * Write raw data in console without any verbose restriction.
	 *
	 * @param {...*} parameters - Data to print in console.
	 */
	write(...parameters) {
		parameters.forEach((parameter) => {
			this.terminal.echo(parameter);
		});
	}

	/**
	 * Print spammy message for developers.
	 *
	 * @param  {...*} parameters - Data to print as spam.
	 */
	spam(...parameters) {
		this.print(3, ...parameters);
	}

	/**
	 * Print debug information.
	 *
	 * @param  {...*} parameters - Data to print as debug.
	 */
	debug(...parameters) {
		this.print(2, ...parameters);
	}

	/**
	 * Print log information.
	 *
	 * @param  {...*} parameters - Data to print as log.
	 */
	log(...parameters) {
		this.print(1, ...parameters);
	}

	/**
	 * Print information.
	 *
	 * @param  {...*} parameters - Data to print as info.
	 */
	info(...parameters) {
		this.print(0, ...parameters);
	}

	/**
	 * Print success message.
	 *
	 * @param  {...*} parameters - Data to print as success.
	 */
	success(...parameters) {
		parameters.forEach((parameter) => {
			this.terminal.success(parameter);
		});
	}

	/**
	 * Print warning message.
	 *
	 * @param  {...*} parameters - Data to print as warning.
	 */
	warning(...parameters) {
		parameters.forEach((parameter) => {
			this.terminal.warning(parameter);
		});
	}

	/**
	 * Print failure message.
	 *
	 * @param  {...*} parameters - Data to print as failure.
	 */
	failure(...parameters) {
		parameters.forEach((parameter) => {
			this.terminal.failure(parameter);
		});
	}

	/**
	 * Print information based on the print level and verbose level.
	 *
	 * @param {number} level - The level of verbosity of the print.
	 * @param  {...*} parameters - Data to print.
	 */
	print(level, ...parameters) {
		if (this.verbose >= level) {
			parameters.forEach((parameter) => {
				this.terminal.print(parameter);
			});
		}
	}

	/**
	 * Prompt the user with a question.
	 *
	 * @param {string} question - The question to ask.
	 * @param {string|null} [defaultAnswer] - The default answer.
	 * @returns {Promise<string>} The user answer.
	 */
	ask(question, defaultAnswer = null) {
		return this.terminal.ask(question, defaultAnswer);
	}

	/**
	 * Prompt the user with a question requesting hidden answer.
	 *
	 * @param {string} question - The question to ask.
	 * @returns {Promise<string>} The user answer.
	 */
	secret(question) {
		return this.terminal.secret(question);
	}

	/**
	 * Prompt the user with a confirmation statement requesting a yes/no answer.
	 *
	 * @param {string} statement - The statement to be confirmed.
	 * @param {boolean} [defaultValue] - The default confirmation value.
	 * @returns {Promise<boolean>} The user confirmation.
	 */
	confirm(statement, defaultValue = false) {
		return this.terminal.confirm(statement, defaultValue);
	}

	/**
	 * Prompt the user with a question having a list of available choices.
	 *
	 * @example
	 * command.choice('What color?', ['Red', 'Green', Blue']); // Answer 'Blue' -> returns 'Blue'
	 * command.choice('What size?', { s: 'Small', m: 'Medium', l: 'Large' }); // Answer 'Medium' -> returns 'l'
	 *
	 * @param {string} question - The question to ask.
	 * @param {Array<string>|object<string, string>} choices - The available answers.
	 * @param {string} [defaultValue] - The default answer.
	 * @returns {Promise<string>} The user answer.
	 */
	choice(question, choices, defaultValue) {
		return this.terminal.choice(question, choices, defaultValue);
	}

	/**
	 * Print a table with list of models.
	 *
	 * @example
	 * command.table(['Key', 'Value'], [['foo', 'bar'], ['baz', 'qux'], ['some key', 'some value']]);
	 *
	 * @param {Array<string>} header - The table header.
	 * @param {Array<Array<string>>} data - The table content.
	 */
	table(header, data) {
		this.terminal.table(header, data);
	}

	/**
	 * Print multiple tables.
	 *
	 * @param {Array<*>} tables - The tables to print.
	 * @param {boolean} [sideBySide] - If set to true, the tables will be printed side by side instead of one under the other.
	 * @param {*} [options] - The table options.
	 */
	tables(tables, sideBySide, options = {}) {
		this.terminal.tables(tables, sideBySide, options);
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
	 * @returns {console.Command} The current command.
	 */
	captureOutput() {
		this.interceptor.mute().removeStyle().add(this.outputInterceptor);

		return this;
	}

	/**
	 * Stop the output capture by the default interceptor.
	 *
	 * @returns {console.Command} The current command.
	 */
	stopCaptureOutput() {
		this.interceptor.remove(this.outputInterceptor).keepStyle().unmute();

		return this;
	}

	/**
	 * Get the captured output.
	 *
	 * @param {boolean} [stopCapture] - Indicates if the capture should stop.
	 * @returns {string} The captured output.
	 */
	getCapturedOutput(stopCapture = true) {
		if (stopCapture) {
			this.stopCaptureOutput();
		}

		return __(this).get('capturedOutput');
	}

	/**
	 * Translate with the translator service.
	 * If it does not exist, returns the given string.
	 *
	 * @param {string} key - The translation key to translate.
	 * @param {...*} parameters - Translator's translate parameters.
	 * @returns {string} The translated content.
	 */
	t(key, ...parameters) {
		if (this.app.isBound('translator')) {
			return this.app.make('translator').translate(key, ...parameters);
		}

		return key;
	}

	/**
	 * Get verbose level, from 0 to 3.
	 *
	 * @example
	 * "node ioc some:command"; // 0
	 * "node ioc some:command --verbose"; // 1
	 * "node ioc some:command -v"; // 1
	 * "node ioc some:command -vv"; // 2
	 * "node ioc some:command -vvv"; // 3
	 *
	 * @type {number}
	 */
	get verbose() {
		return __(this).get('verbose');
	}

	/**
	 * Yargs instance accessor.
	 *
	 * @type {yargs}
	 */
	get yargs() {
		return __(this).get('yargs');
	}

	/**
	 * Yargs mutator.
	 *
	 * @param {yargs} yargs - The Yargs instance.
	 */
	set yargs(yargs) {
		this.setYargs(yargs);
	}

	/**
	 * Define the current Yargs instance.
	 *
	 * @param {yargs} yargs - The Yargs instance.
	 */
	setYargs(yargs) {
		__(this).set('yargs', yargs);
	}

	/**
	 * Set the current arguments from the console.
	 * Those arguments should be processed by Yargs first.
	 *
	 * @param {*} argv - The Yargs arguments.
	 */
	setArgv(argv) {
		const { args: { parameters, options, flags } } = this;
		const list = [...parameters, ...options, ...flags];
		list.forEach((argument) => {
			if (Object.prototype.hasOwnProperty.call(argv, argument.name)) {
				argument.value = argv[argument.name];
			}
		});

		__(this).set('verbose', argv.v || (argv.verbose ? 1 : 0));
	}

	/**
	 * Build yargs model.
	 *
	 * @returns {{builder, describe: string, command: string}} The Yargs model.
	 */
	buildYargsModel() {
		if (this.forward) {
			const model = this.app.make('command').get(this.forward).buildYargsModel();
			model.command = model.command.replace(this.forward, this.name);

			return model;
		}

		const { parameters, options, flags } = __(this).get('arguments');

		return {
			builder: (yargs) => {
				parameters.forEach(({ name, yargsModel }) => {
					yargs.positional(name, yargsModel);
				});

				[...options, ...flags].forEach(({ name, yargsModel }) => {
					yargs.option(name, yargsModel);
				});
			},
			command: this.signature,
			describe: this.description
		};
	}

	/**
	 * Yargs command model accessor.
	 *
	 * @type {{builder, describe: string, command: string}}
	 */
	get yargsModel() {
		return this.buildYargsModel();
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
	 * The terminal interceptor.
	 *
	 * @type {console.services.Interceptor}
	 */
	get interceptor() {
		return this.app.make('terminal.interceptor');
	}

}


export default Command;
