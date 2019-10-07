//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------
'use strict';

const Command             = require('./Command');
const NotImplementedError = require('../foundation/exceptions/NotImplementedError');


class GeneratorCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return `Create a ${this.type} class.`;
	}

	/**
	 * Files accessor.
	 *
	 * @type {object<string, string>}
	 * @abstract
	 */
	get files() {
		throw new NotImplementedError(this, 'files', 'associative set of paths', 'accessor')
	}

	/**
	 * Destination accessor.
	 *
	 * @type {string}
	 * @abstract
	 */
	get destination() {
		throw new NotImplementedError(this, 'destination', 'string', 'accessor');
	}

	/**
	 * Filename accessor.
	 *
	 * @type {string}
	 */
	get filename() {
		return `${this.parameter('class')}.js`;
	}

	/**
	 * Replacement patterns accessor.
	 *
	 * @type {object<string, string>}
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
		const content = this.replace(this.load(type), {
			CLASS: this.parameterIsSupported('class') ? this.parameter('class').split('/').pop() : undefined,
			PROJECT: this.app.make('config').get('app.name', 'Node IoC'),
			...this.patterns
		});

		return this.write(content);
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
	 * @param {string} content
	 * @returns {Promise<boolean>}
	 */
	async write(content) {
		const fileManager = this.app.make('file');
		const fileEngine  = this.app.make('file.engine');
		const file        = this.getDestination();

		await fileEngine.async.ensureDir(this.app.formatPath(file, '..'));

		return fileManager.driver('text').writeAsync(file, content);
	}

	/**
	 * Get destination folder.
	 *
	 * @returns {string}
	 */
	getDestination() {
		const { filename } = this;

		if (!this.optionIsSupported('destination') || !this.option('destination')) {
			return this.app.formatPath(this.destination, filename);
		}

		return this.app.formatPath(process.cwd(), this.option('destination'), filename);
	}

	/**
	 * {@inheritdoc}
	 */
	get parameters() {
		return [
			['class', true, null, `Class name of the ${this.type}.`]
		];
	}

	/**
	 * {@inheritdoc}
	 */
	get options() {
		return [
			['destination', null, 'File destination.']
		];
	}

	/**
	 * Get the class type that is being made.
	 *
	 * @type {string}
	 */
	get type() {
		const type = this.constructor.name.replace(/^Make(?<name>.*)Command$/u, '$<name>') || this.name.split(':')[1];

		return this.app.make('helper.string').lower(type);
	}

}


module.exports = GeneratorCommand;
