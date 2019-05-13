//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';

const path = require('path');

const Command = require('./Command');


class GeneratorCommand extends Command {

	/**
	 * Files accessor.
	 *
	 * @returns {{[name]: {string}}}
	 * @abstract
	 */
	get files() {
		throw new TypeError('Accessor [files] must be implemented. It should return an associative set of paths.');
	}

	/**
	 * Destination accessor.
	 *
	 * @returns {string}
	 */
	get destination() {
		throw new TypeError('Accessor [destination] must be implemented. It should return a destination folder.');
	}

	/**
	 * Replacement patterns accessor.
	 *
	 * @returns {{[string]: {string}}}
	 */
	get patterns() {
		return {};
	}

	/**
	 * Generate a file of a specific type fron stubs.
	 *
	 * @param {string} type
	 */
	generate(type) {
		const file = this.load(type);
		const formattedFile = this.replace(file, Object.assign({
			COMMAND: this.parameter('class'),
			PROJECT: path.basename(process.cwd())
		}, this.patterns));
		this.write(formattedFile);
	}

	/**
	 * Load a given stub by name.
	 *
	 * @param {string} type
	 * @returns {string}
	 */
	load(type) {
		return this.app.make('file').driver('text').load(this.files[type]);
	}

	/**
	 * Mass replace file parts based on patterns.
	 *
	 * @param {string} file
	 * @param {{[string]: {string}}} patterns
	 * @return {string}
	 */
	replace(file, patterns) {
		return Object.keys(patterns).reduce((string, pattern) => {
			return string.replace(new RegExp(`%${pattern}%`, 'ug'), patterns[pattern]);
		}, file);
	}

	/**
	 * Write the given file to the configured destination folder.
	 *
	 * @param {string} file
	 * @returns {boolean}
	 */
	write(file) {
		return this.app.make('file').write(this.getDestination(), file);
	}

	/**
	 * Get destination folder.
	 *
	 * @returns {string}
	 */
	getDestination() {
		const providedPath = this.option('destination');
		const fileName     = `${this.parameter('class')}.js`;

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

	/**
	 * {@inheritdoc}
	 */
	get options() {
		return [
			['destination', null, 'File destination']
		];
	}

}


module.exports = GeneratorCommand;
