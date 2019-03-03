//--------------------------------------------------------
//-- Node IoC - Console - Command - Terminal
//--------------------------------------------------------
'use strict';


class Terminal {

	/**
	 * Print the given arguments.
	 *
	 * @param {*[]} args
	 */
	print(...args) {
		console.log(...args); // eslint-disable-line no-console
	}

	/**
	 * Get the current console command.
	 *
	 * @returns {string}
	 */
	get command() {
		return process.argv.slice(2).join(' ');
	}

}

module.exports = Terminal;
