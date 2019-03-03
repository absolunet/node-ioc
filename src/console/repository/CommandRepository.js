//--------------------------------------------------------
//-- Node IoC - Console - CommandRepository
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');


class CommandRepository {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * CommandRepository constructor.
	 *
	 * @param {Application} app
	 */
	constructor(app) {
		__(this).set('app', app);
		__(this).set('commands', []);
	}

	/**
	 *
	 * @param grouped
	 * @returns {Command[]|{[name]: Command[]}
	 */
	all(grouped = false) {
		const commands = __(this).get('commands').sort(({ name:a }, { name:b }) => {
			return a.localeCompare(b);
		});

		if (grouped) {
			const groups = {};

			commands.forEach((command) => {
				const prefix = command.name.split(':').shift();
				if (!groups[prefix]) {
					groups[prefix] = [];
				}

				groups[prefix].push(command);
			});

			return groups;
		}


		return commands;
	}

	/**
	 * Get command by name.
	 *
	 * @param {string} name
	 * @returns {Command|null}
	 */
	get(name) {
		return __(this).get('commands').find(({ name:commandName }) => {
			return name === commandName;
		});
	}

	/**
	 * Check if command is registered.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return Boolean(this.get(name));
	}

	/**
	 * Add given command in the command list.
	 *
	 * @param {Command|NewableFunction<Command>} command
	 */
	add(command) {
		__(this).get('commands').push(__(this).get('app').make(command));
	}

}

module.exports = CommandRepository;
