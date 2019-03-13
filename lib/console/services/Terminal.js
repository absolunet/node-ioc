//--------------------------------------------------------
//-- Node IoC - Console - Command - Terminal
//--------------------------------------------------------
'use strict';


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

}

module.exports = Terminal;
