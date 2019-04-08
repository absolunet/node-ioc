//--------------------------------------------------------
//-- Node IoC - Console - Command - Terminal
//--------------------------------------------------------
'use strict';


const inquirer = require('inquirer');
const { table } = require('table');
const { Terminal:BaseTerminal } = require('@absolunet/terminal');


class Terminal extends BaseTerminal {

	/**
	 * Get the current console command.
	 *
	 * @returns {string}
	 */
	get command() {
		return process.argv.slice(2).join(' ');
	}

	/**
	 * Get the current console command arguments.
	 *
	 * @returns {string}
	 */
	get args() {
		return this.command.split(' ').slice(1).join(' ');
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
		const { answer } = await inquirer.prompt(Object.assign({
			message: question,
			name: 'answer',
			type: 'input',
			default: defaultAnswer
		}, options));

		return answer;
	}

	/**
	 * Ask a question to the user with a secret answer.
	 *
	 * @param question
	 * @returns {Promise<string|null>}
	 */
	secret(question) {
		return this.ask(question, null, { type:'password' });
	}

	/**
	 * Ask the user to confirm an action.
	 *
	 * @param statement
	 * @param defaultValue
	 * @returns {Promise<boolean>}
	 */
	async confirm(statement, defaultValue = false) {
		const { confirmed } = await inquirer.prompt({
			'message': statement,
			'name': 'confirmed',
			'type': 'confirm',
			'default': defaultValue
		});

		return confirmed;
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
		const choicesKeys = Array.isArray(choices) ? choices : Object.keys(choices);
		const choicesValues = Array.isArray(choices) ? choices : Object.values(choices);

		const { choice } = await inquirer.prompt({
			'message': question,
			'name': 'choice',
			'type': 'list',
			'choices': choicesValues,
			'default': defaultValue
		});

		return choicesKeys[choicesValues.indexOf(choice)];
	}

	/**
	 * Print a table with list of models.
	 *
	 * @param {string[]} header
	 * @param {{[string]: {string}}[]} data
	 * @param {*} options
	 */
	table(header, data, options = {}, print = true) {
		const dataIsMainData = data && Array.isArray(data);
		const headerData = dataIsMainData && header.length ? [header, Array(header.length)] : [];
		const tableData = dataIsMainData ? data : header;
		const optionData = options || data || {};
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
	 */
	tables(tables, sideBySide = false, options = {}) {
		const results = tables.map((data) => {
			return this.table([], data, options, false);
		});

		let str;

		if (sideBySide) {
			str = '';

			const splitResults = results.map((result) => {
				return result.split('\n');
			});
			const higherLength = splitResults.reduce((l, { length }) => {
				return l < length ? length : l;
			}, 0);

			for (let i = 0; i < higherLength; i++) {
				splitResults.forEach((rows) => {
					const width = rows[0].length;
					str += `\t${rows[i] || Array(width).map(() => {
						return ' ';
					}).join('')}`;
				});
				str += '\n';
			}
		} else {
			str = results.join('\n');
		}

		this.print(str);
	}

}

module.exports = Terminal;
