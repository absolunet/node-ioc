//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';

const path    = require('path');
const Command = require('./Command');


class GeneratorCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return `Create a ${this.type} class`;
	}

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
	 * Filename accessor.
	 *
	 * @returns {string}
	 */
	get filename() {
		return `${this.parameter('class')}.js`;
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
	 * Generate a file of a specific type from stubs.
	 *
	 * @param {string} type
	 * @returns {Promise<boolean>}
	 */
	generate(type) {
		const file = this.load(type);
		const formattedFile = this.replace(file, {
			CLASS: this.parameterIsSupported('class') ? this.parameter('class') : undefined,
			PROJECT: path.basename(process.cwd()),
			...this.patterns
		});

		return this.write(formattedFile);
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
	 * @param {Object<string, string>} patterns
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
	 * @returns {Promise<boolean>}
	 */
	async write(file) {
		const fileManager = this.app.make('file');
		const fileEngine  = this.app.make('file.engine');
		const destination = this.getDestination();

		await fileEngine.async.ensureDir(path.join(destination, '..'));

		return fileManager.driver('text').writeAsync(destination, file);
	}

	/**
	 * Get destination folder.
	 *
	 * @returns {string}
	 */
	getDestination() {
		const { filename } = this;

		if (!this.optionIsSupported('destination') || !this.option('destination')) {
			return path.resolve(this.destination, filename);
		}

		return path.resolve(process.cwd(), this.option('destination'), filename);
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [
			['class', true, null, `Class name of the ${this.type}`]
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

	/**
	 * Get the class type that is being made.
	 *
	 * @returns {string}
	 */
	get type() {
		return this.app.make('helper.string')
			.lower(this.constructor.name.replace(/^Make(?<name>.*)Command$/u, '$<name>'));
	}

}


module.exports = GeneratorCommand;
