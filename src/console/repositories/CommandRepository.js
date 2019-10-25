//--------------------------------------------------------
//-- Node IoC - Console - CommandRepository
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Command repository that stores all the register commands through the command registrar.
 *
 * @memberof console.repositories
 * @hideconstructor
 */
class CommandRepository {

	/**
	 * Class dependencies: <code>['app', 'terminal', 'yargs']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'terminal', 'yargs'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('commands', []);

		if (this.app.isBound('gate')) {
			__(this).set('gate', this.app.make('gate'));
		}
	}

	/**
	 * Get all commands.
	 * Can return either an array of commands or a dictionary associating groups of commands based on names.
	 *
	 * @param {boolean} [withPolicies] - Use gate service to filter valid commands by policies.
	 * @param {boolean} [grouped] - Request grouped command result instead of a single array.
	 * @returns {Array<Command>|object<string,Array<Command>>} The commands or the grouped commands.
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

		if (!grouped) {
			return commands;
		}

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

	/**
	 * Get command by name.
	 *
	 * @param {string} name - The command name.
	 * @returns {console.Command|null} The command instance, or null if not found.
	 */
	get(name) {
		return __(this).get('commands').find(({ name: commandName }) => {
			return name === commandName;
		}) || null;
	}

	/**
	 * Check if command is registered.
	 *
	 * @param {string} name - The command name.
	 * @returns {boolean} Indicates if the command exists.
	 */
	has(name) {
		return Boolean(this.get(name));
	}

	/**
	 * Add given command in the command list.
	 *
	 * @param {Function|console.Command} command - The command class or instance.
	 * @returns {console.Command} The command instance.
	 */
	add(command) {
		const { app, terminal, yargs } = this;
		const instance = app.make(command, { app, terminal, yargs });
		__(this).get('commands').push(instance);

		return instance;
	}

}


export default CommandRepository;
