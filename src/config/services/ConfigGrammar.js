//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------


/**
 * Class that handle configuration specific grammar.
 * It formats configuration entry by replacing specific tokens and patterns.
 * It also uses the evaluator to return evaluated value in addition to the token parsing.
 *
 * @example
 * configGrammar.format('foo'); // "foo"
 * configGrammar.format('@/foo'); // "/path/to/application/foo"
 * configGrammar.format('~/foo'); // "/path/to/home/foo"
 * configGrammar.format('{{NODE_ENV}}'); // "production"
 * configGrammar.format('{{NODE_ENV|local}}'); // "production"
 * configGrammar.format('{{UNDEFINED_VAR|default value}} "default value"
 *
 * @memberof config.services
 * @hideconstructor
 */
class ConfigGrammar {

	/**
	 * Class dependencies: <code>['app', 'env', 'evaluator']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'env', 'evaluator'];
	}

	/**
	 * Replacement pipeline.
	 *
	 * @type {Array<string>}
	 */
	get pipeline() {
		return [
			'formatEnvironment',
			'formatPath'
		];
	}

	/**
	 * Replacements list accessor.
	 *
	 * @type {object<string, Array<{search: RegExp, replace: string}>>}
	 */
	get replacements() {
		return {
			path: [
				{ search: /^@\//u, replace: `${this.app.basePath()}/` },
				{ search: /^~\//u, replace: `${this.app.homePath()}/` }
			],
			environment: [
				{
					search: /\{\{(?<variable>\w+)(?:\|(?<fallback>.*))?\}\}/u,
					replace: (match, variable, fallback) => {
						return this.env.get(variable, fallback || null);
					}
				}
			]
		};
	}

	/**
	 * Format given configuration value.
	 *
	 * @param {*} value - The value to format.
	 * @returns {*} The formatted value.
	 */
	format(value) {
		return this.pipeline.reduce((formattedValue, action) => {
			return this[action](formattedValue);
		}, value);
	}

	/**
	 * Parse environment variable in configuration value.
	 *
	 * @param {string} value - The value to format.
	 * @returns {string} The formatted value.
	 */
	formatEnvironment(value) {
		if (typeof value !== 'string') {
			return value;
		}

		return this.replaceValue(value, 'environment');
	}

	/**
	 * Format given path to absolute path.
	 *
	 * @param {string} value - The value to format.
	 * @returns {string} The formatted value.
	 */
	formatPath(value) {
		if (typeof value === 'string') {
			const filePath = this.replaceValue(value, 'path');

			if (filePath !== value) {
				return this.app.formatPath(filePath);
			}
		}

		return value;
	}

	/**
	 * Replace value by the given replacement type configured patterns.
	 *
	 * @param {string} value - The value to format.
	 * @param {string} type - The type of replacement to operate. The type should be an existing key of the replacements property.
	 * @returns {boolean|null|number|string} The formatted value.
	 */
	replaceValue(value, type) {
		return this.evaluator.evaluate(this.replacements[type].reduce((text, { search, replace }) => {
			return text.replace(search, replace);
		}, value));
	}

}


export default ConfigGrammar;
