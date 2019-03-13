//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';


const Command = require('./Command');
const path = require('path');


class GeneratorCommand extends Command {

	get files() {
		throw new TypeError('You must implement files property. It should returns an associative set of paths');
	}

	get destination() {
		throw new TypeError('You must implement destination property. It should returns a destination folder');
	}

	get patterns() {
		return {};
	}

	generate(type) {
		const file = this.load(type);
		const formattedFile = this.replace(file, Object.assign({
			COMMAND: this.parameter('class'),
			PROJECT: path.basename(process.cwd())
		}, this.patterns));
		this.write(formattedFile);
	}

	load(type) {
		return this.app.make('file').driver('text').load(this.files[type]);
	}

	replace(file, patterns) {
		return Object.keys(patterns).reduce((string, pattern) => {
			return string.replace(new RegExp(`%${pattern}%`, 'ug'), patterns[pattern]);
		}, file);
	}

	write(file) {
		return this.app.make('file').write(this.getDestination(), file);
	}

	getDestination() {
		const providedPath = this.option('destination');
		const fileName = `${this.parameter('class')}.js`;

		if (!providedPath) {
			return path.resolve(this.destination, fileName);
		}

		return path.resolve(process.cwd(), providedPath, fileName);
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [
			['class', true, null, 'Class name of the command']
		];
	}

	get options() {
		return [
			['destination', null, 'File destination']
		];
	}

}


module.exports = GeneratorCommand;
