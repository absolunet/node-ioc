//--------------------------------------------------------
//-- Spark IoC - Console - CommandRepository
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class CommandRepository {

	static get dependencies() {
		return ['app'];
	}

	constructor(app) {
		__(this).set('app', app);
		__(this).set('commands', []);
	}

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

	get(name) {
		return __(this).get('commands').find(({ name:commandName }) => {
			return name === commandName;
		});
	}

	has(name) {
		return Boolean(this.get(name));
	}

	add(command) {
		__(this).get('commands').push(__(this).get('app').make(command));
	}

	toString() {
		const groups = this.all(true);

		let str = '';
		Object.keys(groups).forEach((group) => {
			str += `${group}\n`;
			str += groups[group].map(({ name }) => {
				return `\t${name}`;
			}).join(`\n`);
		});

		return str;
	}

}

module.exports = CommandRepository;
