//--------------------------------------------------------
//-- Spark IoC - Console - Command
//--------------------------------------------------------
'use strict';


const Parameter = require('./Parameter');
const Option = require('./Option');
const Flag = require('./Flag');

const argumentMapping = {
	parameters: Parameter,
	options: Option,
	flags: Flag
};


class Command {

	get name() {
		throw new Error('Command name must be implemented.');
	}

	get signature() {
		const { name:commandName } = this;
		const parameters = this.getFormattedParameters().map(({ name, required, defaultValue }) => {
			return `<${name}${!required ? `=${defaultValue || ''}` : ''}>`;
		}).join(' ');

		const options = this.getFormattedOptions().map(({ name, defaultValue }) => {
			return `[--${name}=${defaultValue || ''}]`;
		}).join(' ');

		const flags = this.getFormattedFlags().map(({ name }) => {
			return `[--${name}]`;
		});

		return `${commandName} ${parameters} ${options} ${flags}`.replace(/\s+/gu, ' ').trim();
	}

	handle() {

		/* ... */
	}

	parameters() {
		return [];
	}

	options() {
		return [];
	}

	flags() {
		return [];
	}

	getFormatted(type) {
		const Argument = argumentMapping[type];
		if (!Argument) {
			throw new Error(`Argument type ${type} does not exists.`);
		}

		return this[type]().map((argument) => {
			if (typeof argument === 'string') {
				return new Argument(argument);
			}

			if (Array.isArray(argument)) {
				return new Argument(...argument);
			}

			return argument;
		});
	}

	getFormattedParameters() {
		return this.getFormatted('parameters');
	}

	getFormattedOptions() {
		return this.getFormatted('options');
	}

	getFormattedFlags() {
		return this.getFormatted('flags');
	}

}


module.exports = Command;
