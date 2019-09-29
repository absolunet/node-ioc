//--------------------------------------------------------
//-- Node IoC - Console - Services - Terminal
//--------------------------------------------------------
'use strict';

const { Terminal: BaseTerminal } = require('@absolunet/terminal');


class Terminal extends BaseTerminal {

	/**
	 * Get the process argv.
	 *
	 * @returns {string[]}
	 */
	get argv() {
		return process.argv.slice(2);
	}

	/**
	 * Get the current console command.
	 *
	 * @returns {string}
	 */
	get command() {
		return this.argv.join(' ');
	}

	/**
	 * Get the current console command arguments.
	 *
	 * @returns {string}
	 */
	// eslint-disable-next-line unicorn/prevent-abbreviations
	get args() {
		return this.argv.slice(1).join(' ');
	}

	/**
	 * @type {Inquirer}
	 */
	get inquirer() {
		return require('inquirer'); // eslint-disable-line global-require
	}

	/**
	 * Ask a question to the user.
	 *
	 * @param question
	 * @param defaultAnswer
	 * @param options
	 * @returns {Promise<string|null>}
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
	 * @param question
	 * @returns {Promise<string|null>}
	 */
	secret(question) {
		return this.ask(question, null, { type: 'password' });
	}

	/**
	 * Ask the user to confirm an action.
	 *
	 * @param statement
	 * @param defaultValue
	 * @returns {Promise<boolean>}
	 */
	async confirm(statement, defaultValue = false) {
		const answer = await this.ask(statement, Boolean(defaultValue), { type: 'confirm' });

		return Boolean(answer);
	}

	/**
	 * Ask a question with a list of potential answers to the user.
	 *
	 * @param {string} question
	 * @param {string[]|*} choices
	 * @param {string} [defaultValue]
	 * @returns {Promise<string>}
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
	 * @param {string[]} header
	 * @param {{[string]: {string}}[]} data
	 * @param {object} [options={}]
	 * @param {boolean} [print=true]
	 * @returns {Terminal|string}
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
	 * @param {*[]} tables
	 * @param {boolean} [sideBySide]
	 * @param {*} [options]
	 * @param {boolean} [print=true]
	 * @returns {Terminal|string}
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


module.exports = Terminal;
