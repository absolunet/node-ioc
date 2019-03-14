//--------------------------------------------------------
//-- Node IoC - Console - Command - Terminal
//--------------------------------------------------------
'use strict';


const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});


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

	ask(question, defaultAnswer) {
		return new Promise((resolve) => {
			rl.question(`${question} : `, (answer) => {
				resolve(answer === null ? defaultAnswer : answer);
			});
		});
	}

}

module.exports = Terminal;
