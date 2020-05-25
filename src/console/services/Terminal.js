//--------------------------------------------------------
//-- Node IoC - Console - Services - Terminal
//--------------------------------------------------------

import { Terminal as BaseTerminal } from '@absolunet/terminal';

/**
 * The enhanced Absolunet terminal class.
 *
 * @memberof console.services
 * @hideconstructor
 */
class Terminal extends BaseTerminal {

	/**
	 * The <a href="https://www.npmjs.com/package/chalk">Chalk</a> instance.
	 *
	 * @type {Chalk}
	 */
	get chalk() {
		return require('chalk'); // eslint-disable-line global-require
	}

	/**
	 * Get the currently executed file. By default, should be "ioc".
	 *
	 * @type {string}
	 */
	get file() {
		return process.argv[1];
	}

	/**
	 * Get the process argv.
	 *
	 * @type {Array<string>}
	 */
	get argv() {
		return process.argv.slice(2);
	}

	/**
	 * Get the current console command.
	 *
	 * @type {string}
	 */
	get command() {
		return this.argv.join(' ');
	}

	/**
	 * Get the current console command arguments.
	 *
	 * @returns {string} The arguments.
	 */
	get args() { // eslint-disable-line unicorn/prevent-abbreviations
		return this.argv.slice(1).join(' ');
	}

	/**
	 * The inquirer module.
	 *
	 * @type {Inquirer}
	 */
	get inquirer() {
		return require('inquirer'); // eslint-disable-line global-require
	}

	/**
	 * Spawn a process as a promise.
	 *
	 * @param {string} command - The command to run.
	 * @param {Array<string>} parameters - The command arguments.
	 * @param {object} options - The spawn options.
	 * @returns {Promise} The async process promise.
	 */
	async spawn(command, parameters, options) {
		await new Promise((resolve, reject) => {
			this.crossSpawn(command, parameters, options)
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
	 * Spawn a process in sync mode.
	 *
	 * @param {string} command - The command to run.
	 * @param {Array<string>} parameters - The command arguments.
	 * @param {object} options - The spawn options.
	 */
	spawnSync(command, parameters, options) {
		this.crossSpawn.sync(command, parameters, options);
	}

	/**
	 * The cross-spawn module.
	 *
	 * @type {spawn}
	 */
	get crossSpawn() {
		return require('cross-spawn'); // eslint-disable-line global-require
	}

	/**
	 * Ask a question to the user.
	 *
	 * @param {string} question - The question to ask.
	 * @param {string|null} defaultAnswer - The default answer.
	 * @param {object} options - The inquirer options.
	 * @returns {Promise<string|null>} The user answer.
	 */
	async ask(question, defaultAnswer = null, options = {}) {
		const { answer } = await this.inquirer.prompt({
			'message': question,
			'name':    'answer',
			'type':    'input',
			'default': defaultAnswer,
			...options
		});

		return answer;
	}

	/**
	 * Ask a question to the user with a secret answer.
	 *
	 * @param {string} question - The question to ask.
	 * @param {object} [options={}] - The inquirer options.
	 * @returns {Promise<string|null>} The user answer.
	 */
	secret(question, options = {}) {
		return this.ask(question, null, { ...options, type: 'password' });
	}

	/**
	 * Ask the user to confirm an action.
	 *
	 * @param {string} statement - The confirmation statement.
	 * @param {boolean} [defaultValue=false] - The default confirmation value.
	 * @returns {Promise<boolean>} The user confirmation.
	 */
	async confirm(statement, defaultValue = false) {
		const answer = await this.ask(statement, Boolean(defaultValue), { type: 'confirm' });

		return Boolean(answer);
	}

	/**
	 * Ask a question with a list of potential answers to the user.
	 *
	 * @param {string} question - The question to ask.
	 * @param {Array<string>|object<string, string>} choices - The available choices.
	 * @param {string} [defaultValue] - The default value.
	 * @returns {Promise<string>} The user answer.
	 */
	async choice(question, choices, defaultValue = '') {
		const choicesKeys   = Array.isArray(choices) ? choices : Object.keys(choices);
		const choicesValues = Array.isArray(choices) ? choices : Object.values(choices);

		const answer = await this.ask(question, defaultValue, {
			type:    'list',
			choices: choicesValues
		});

		return choicesKeys[choicesValues.indexOf(answer)];
	}

	/**
	 * Print a table with list of models.
	 *
	 * @param {Array<string>} header - The table header.
	 * @param {Array<object<string,string>>} data - The table data.
	 * @param {object} [options={}] - The table options.
	 * @param {boolean} [print=true] - Indicates if the table should be printed or returned as a string.
	 * @returns {console.services.Terminal|string} Either the terminal or the table as string.
	 */
	table(header, data, options = {}, print = true) {
		const { table }      = require('table'); // eslint-disable-line global-require
		const dataIsMainData = data && Array.isArray(data);
		const headerData     = dataIsMainData && header.length !== 0 ? [header, new Array(header.length)] : [];
		const tableData      = dataIsMainData ? data : header;
		const optionData     = (typeof options === 'object' ? options : null) || data || {};
		const defaultOptions = {};

		const result = table(headerData.concat(tableData), Object.assign(defaultOptions, optionData))
			.replace(/\n. (?![a-zA-Z0-9]+).*\n/gu, '\n');

		return print ? this.print(result) : result;
	}

	/**
	 * Print multiple tables.
	 *
	 * @param {Array<Array<Array<string>>>} tables - The tables.
	 * @param {boolean} [sideBySide=false] - Indicates that the tables should be side by side instead on one under the other.
	 * @param {object} [options={}] - The table options.
	 * @param {boolean} [print=true] - Indicates if the table should be printed or returned as a string.
	 * @returns {console.services.Terminal|string} Either the terminal or the table as string.
	 */
	tables(tables, sideBySide = false, options = {}, print = true) {
		const results = tables.map((data) => {
			return this.table([], data, options, false);
		});

		let text;

		if (sideBySide) {
			text = '';

			const splitResults = results.map((result) => {
				return result.split('\n');
			});
			const higherLength = splitResults.reduce((l, { length }) => {
				return l < length ? length : l;
			}, 0);

			for (let i = 0; i < higherLength; i++) {
				splitResults.forEach((rows, index) => {  // eslint-disable-line no-loop-func
					const width = rows[0].length;
					text += `${index > 0 ? '\t' : ''}${rows[i] || new Array(width).map(() => {
						return ' ';
					}).join('')}`;
				});
				text += '\n';
			}
			text = `${text.trim()}\n`;
		} else {
			text = results.join('\n');
		}

		return print ? this.print(text) : text;
	}

}


export default Terminal;
