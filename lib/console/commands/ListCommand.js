//--------------------------------------------------------
//-- Node IoC - Console - Command - List
//--------------------------------------------------------
'use strict';

const Command = require('./../Command');


class ListCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['public'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'list';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'List all available commands';
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		this.captureOutput().call('--help', false);

		this.printPrettifiedYargsHelp(this.getCapturedOutput());
	}

	/**
	 * Print prettified text based on the default Yargs --help output.
	 *
	 * @param {string} help
	 */
	printPrettifiedYargsHelp(help) {
		const lines = help.split(`\n`);

		// This line is hard coded by Yargs, so we can assume it will always be printed.
		// We add 2 here to skip the 'Commands' string and the first command, which is always
		// the default one, without any signature.
		const index = lines.indexOf('Commands:') + 2;

		// The space after the commands is also hard coded by Yargs.
		const lastIndex = lines.indexOf('', index);

		const optionLines = lines.slice(lastIndex + 1).map((line) => {
			return line.replace(/ +\[\w+\]$/u, '');
		});


		const groups = this.getCommandGroups();


		this.terminal.spacer();
		this.terminal.echo(this.app.make('config').get('app.name'));
		this.terminal.spacer();
		this.terminal.echo('Usage:');
		this.terminal.print('command [arguments] [options]');
		this.terminal.spacer();
		this.terminal.echo('Available commands:');

		Object.keys(groups).sort().forEach((group) => {
			if (group) {
				this.terminal.print(group);
			}
			groups[group].forEach((item) => {
				if (item.trim().length > 0) {
					this.terminal.echo(`   ${item.trim()}`);
				}
			});
		});

		this.terminal.spacer();

		this.terminal.echo(optionLines.join(`\n`));
	}

	/**
	 * Get Command groups.
	 */
	getCommandGroups() {
		const commandRepository = this.app.make('command');
		const all = commandRepository.all(true, true);
		const indent = Object.values(all)
			.flat()
			.sort(({ name: a }, { name: b }) => {
				return a.length - b.length;
			})
			.pop().name.length + 2;

		const groups = {};

		Object.keys(all).forEach((group) => {
			groups[group] = all[group].map((command) => {
				const { name } = command;
				const description = this.getCommandDescription(command);

				return `${name}${' '.repeat(indent - name.length)}${description}`;
			});
		});

		return groups;
	}

	/**
	 * Get command description.
	 *
	 * @param {Command} command
	 * @returns {string}
	 */
	getCommandDescription(command) {
		const commandRepository = this.app.make('command');

		let rootCommand = command;
		let { name, description, forward } = rootCommand;

		while (rootCommand && forward && (!description || description === name)) {
			rootCommand = commandRepository.get(forward);
			if (rootCommand) {
				({ name, description, forward } = rootCommand);
			}
		}

		return description;
	}

}

module.exports = ListCommand;
