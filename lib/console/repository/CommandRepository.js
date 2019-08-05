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
	 * Initialize command repository
	 */
	init() {
		__(this).set('commands', []);
		if (this.app.isBound('gate')) {
			__(this).set('gate', this.app.make('gate'));
		}
	}

	/**
	 *
	 * @param {boolean} [withPolicies]
	 * @param {boolean} [grouped]
	 * @returns {Command[]}
	 */
	all(withPolicies = true, grouped = false) {
		const gate = __(this).get('gate');
		const commands = __(this).get('commands')
			.filter(({ policies = [] }) => {
				return !withPolicies || policies.every((scope) => {
					return !gate || gate.can(scope);
				});
			})
			.sort(({ name: a }, { name: b }) => {
				return a.localeCompare(b);
			});

		if (grouped) {
			const groups = {};

			commands.forEach((command) => {
				const { name } = command;

				if (name !== '*') {
					let prefix = name.split(':').shift();
					prefix = prefix === name ? '' : prefix;

					if (!groups[prefix]) {
						groups[prefix] = [];
					}

					groups[prefix].push(command);
				}
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
		return __(this).get('commands').find(({ name: commandName }) => {
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
	 * @param {Command|Function<Command>} command
	 */
	add(command) {
		__(this).get('commands').push(this.app.make(command));
	}

}


module.exports = CommandRepository;
