//--------------------------------------------------------
//-- Node IoC - Console - Command
//--------------------------------------------------------

import Command             from './Command';
import NotImplementedError from '../foundation/exceptions/NotImplementedError';


/**
 * This abstract class allows to create a command that generates a file.
 * It is normally used to create a command, a controller, a migration, any kind of file.
 * It relies on existing stub that will be formatted with a given grammar.
 *
 * @memberof console
 * @augments console.Command
 * @abstract
 * @hideconstructor
 */
class GeneratorCommand extends Command {

	/**
	 * @inheritdoc
	 */
	get description() {
		return `Create a ${this.type} class.`;
	}

	/**
	 * Files accessor.
	 * It should offers a dictionary associating the type of file to the specific stub.
	 *
	 * @type {object<string, string>}
	 * @abstract
	 */
	get files() {
		throw new NotImplementedError(this, 'files', 'associative set of paths', 'accessor');
	}

	/**
	 * Destination accessor.
	 * It should indicates the root folder in which the file should be written.
	 * If it returns /foo/bar and the file to be created is baz/Qux, the the final destination will be /foo/bar/baz/Qux.js.
	 *
	 * @type {string}
	 * @abstract
	 */
	get destination() {
		throw new NotImplementedError(this, 'destination', 'string', 'accessor');
	}

	/**
	 * Filename accessor.
	 * It build the file name based on user input.
	 *
	 * @type {string}
	 */
	get fileName() {
		return `${this.parameter('class')}.js`;
	}

	/**
	 * Replacement patterns accessor.
	 *
	 * @example
	 * const { patterns } = generatorCommand; // { REPLACE: "bar" }
	 * const stub = 'Foo %REPLACE% baz';
	 * generatorCommand.replace(stub, patterns); // "Foo bar baz"
	 *
	 * @type {object<string, string>}
	 */
	get patterns() {
		return {};
	}

	/**
	 * Generate a file of a specific type from stubs.
	 *
	 * @param {string} type - The file type to generate.
	 * @returns {Promise<boolean>} The async writing process.
	 * @see GeneratorCommand#files
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
	 * @param {string} type - The file type to load.
	 * @returns {string} The file content.
	 * @see GeneratorCommand#files
	 */
	load(type) {
		return this.app.make('file').driver('text').load(this.files[type]);
	}

	/**
	 * Mass replace file parts based on patterns.
	 *
	 * @param {string} content - The content to format.
	 * @param {object<string, string>} patterns - The patterns to replace.
	 * @returns {string} The formatted content.
	 */
	replace(content, patterns) {
		return Object.keys(patterns).reduce((string, pattern) => {
			return string.replace(new RegExp(`%${pattern}%`, 'ug'), patterns[pattern]);
		}, content);
	}

	/**
	 * Write the given file to the configured destination folder.
	 *
	 * @param {string} content - The content to write.
	 * @returns {Promise<boolean>} The async promise.
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
	 * @returns {string} The final file destination.
	 * @see GeneratorCommand#destination
	 * @see GeneratorCommand#fileName
	 */
	getDestination() {
		const { fileName } = this;

		if (!this.optionIsSupported('destination') || !this.option('destination')) {
			return this.app.formatPath(this.destination, fileName);
		}

		return this.app.formatPath(process.cwd(), this.option('destination'), fileName);
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [
			['class', true, null, `Class name of the ${this.type}.`]
		];
	}

	/**
	 * @inheritdoc
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


export default GeneratorCommand;
