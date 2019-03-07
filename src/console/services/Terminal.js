//--------------------------------------------------------
//-- Node IoC - Console - Command - Terminal
//--------------------------------------------------------
'use strict';


const BaseTerminal = require('@absolunet/terminal').constructor;


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
