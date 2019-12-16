//--------------------------------------------------------
//-- Node IoC - Console - Services - Terminal
//--------------------------------------------------------

import { Terminal as BaseTerminal } from '@absolunet/terminal';

/**
 * The enhanced Absolunet terminal class.
 *
 * @memberof console.services
 * @hideconstructor
 */
class Terminal extends BaseTerminal {

	/**
	 * The <a href="https://www.npmjs.com/package/chalk">Chalk</a> instance.
	 *
	 * @member chalk
	 * @type {Chalk}
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Default values.
	 *
	 * @member defaults
	 * @type {{bgColor: Chalk, indent: number, spinnerType: string, logo: string, lang: string, scripts: {path: string, titles: {}}, textColor: Chalk, borderColor: string, spinnerColor: string}}
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Scripts path and titles.
	 *
	 * @member scripts
	 * @type {{path: string, titles: object<string, string>}}
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Set the default terminal properties.
	 *
	 * @function setDefaults
	 * @param {object} properties - Properties.
	 * @param {number} [properties.indent=2] - Indentation used.
	 * @param {string} [properties.logo="?"] - Emoji to be used as logo in TitleBox.
	 * @param {Chalk}  [properties.textColor=this.chalk.blue] - The <a href="https://www.npmjs.com/package/chalk">Chalk definition</a> to be used in project colored outputs.
	 * @param {Chalk}  [properties.bgColor=this.chalk.white.bgBlue] - The <a href="https://www.npmjs.com/package/chalk">Chalk definition</a> to be used in project colored outputs.
	 * @param {string} [properties.borderColor="blue"] - The <a href="https://www.npmjs.com/package/chalk">Color</a> to be used in project colored outputs.
	 * @param {string} [properties.spinnerColor="blue"] - The <a href="https://www.npmjs.com/package/chalk">Color</a> to be used with spinner.
	 * @param {string} [properties.lang="en"] - Language to be used in localized outputs (fr|en).
	 * @param {string} [properties.spinnerType="dots3"] - The <a href="https://www.npmjs.com/package/cli-spinners">Spinner</a> theme.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Set the default terminal properties.
	 *
	 * @function setDefault
	 * @see this.setDefaults()
	 * @deprecated
	 * @param {object} properties - Properties.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Set the default output language.
	 *
	 * @function setLang
	 * @param {string} lang - Language (fr|en).
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Set executable script files root path and associate the file names with a human title.
	 *
	 * @function setScriptsFiles
	 * @param {string} path - Path to scripts files.
	 * @param {object<string, string>} titles - Matching object of script filename to title to be use via `runScript`.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Exit the process and show an optional exit message in an error box.
	 *
	 * @function exit
	 * @param {string} [text] - ErrorBox message to display.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Clean up the string content and adjust intent.
	 *
	 * @function cleanUp
	 * @param {string} text - Text to clean.
	 * @returns {string} Cleaned text.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Translate the given key in current language.
	 *
	 * @function trans
	 * @param {string} key - Translation key.
	 * @param {string} [lang=this.defaults.lang] - Language (fr|en).
	 * @returns {string} Translated text.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Add translations in the translation dictionary.
	 *
	 * @function addTrans
	 * @param {string} key - Translation key.
	 * @param {object<string, string>} values - Translations for each language.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Output a text in the terminal.
	 *
	 * @function echo
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Echo a text after cleaning and indenting it.
	 *
	 * @function echoIndent
	 * @param {string} text - Text to echo.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print a string with default color and indentation.
	 *
	 * @function print
	 * @param {string} text - Text to print.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print a string with default color, indentation and new line at the end.
	 *
	 * @function println
	 * @param {string} text - Text to print.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print one or multiple line breaks.
	 *
	 * @function spacer
	 * @param {number} [number=1] - Number of line breaks to print.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display a warning message.
	 *
	 * @function warning
	 * @param {string} text - Text to output.
	 * @param {boolean} [newline=true] - Add a newline.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display an error message.
	 *
	 * @function error
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display a success message with a check mark icon.
	 *
	 * @function success
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display a failure message with an ⨉ mark icon.
	 *
	 * @function failure
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display an error message indicating not to use "sudo".
	 *
	 * @function dontSudoMe
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print the given state.
	 * If the state is falsy, the given message will be display.
	 *
	 * @function printState
	 * @param {object}  options - Options.
	 * @param {boolean} options.state - If a success or a failure.
	 * @param {string}  options.name - Name of the property.
	 * @param {string}  options.value - Value of the property.
	 * @param {string}  [options.msg] - Detailled error message in case of failure.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print the given files status depending if they were not added, created, modified, renamed or deleted, with a Git flavor.
	 * The available status are: "not_added", "created", "modified", "renamed" and "deleted".
	 *
	 * @function printStatus
	 * @param {object<string, Array<string|{from: string, to: string}>>} status - A <a href="https://www.npmjs.com/package/simple-git">simple-git</a> status object.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print a text in a box.
	 *
	 * @function box
	 * @param {string} text - Text to output.
	 * @param {Chalk} [style] - {@link https://www.npmjs.com/package/chalk Chalk definition}.
	 * @param {boolean} [padding=true] - Add vertical padding.
	 * @param {boolean} [extraPadding=false] - Needs extra padding.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Start timer.
	 *
	 * @function startTimer
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Check if the timer was started.
	 *
	 * @function isTimerStarted
	 * @returns {boolean}
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Stop timer and retrieve the time elapsed between the call and the last startTimer() call.
	 *
	 * @function stopTimer
	 * @returns {number} Number of milliseconds.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print a title in a box.
	 * The logo will be shown as well.
	 *
	 * @function titleBox
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display an informative message box.
	 *
	 * @function infoBox
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display a warning message box.
	 *
	 * @function warningBox
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display an error message box.
	 *
	 * @function errorBox
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display a completion box by using the timer if wanted and started.
	 *
	 * @function completionBox
	 * @param {boolean} [showDuration=true] - Show amount of time since last TitleBox.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Display a bordered box.
	 *
	 * @function borderedBox
	 * @param {string} text - Text to output.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Start a spinner with a given text.
	 *
	 * @function startSpinner
	 * @param text - Text to output.
	 * @returns {Ora} The <a href="https://www.npmjs.com/package/ora">ora spinner</a> object.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Run a command in sync mode.
	 *
	 * @function run
	 * @param {string} command - Command to run.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Run a command in async mode.
	 *
	 * @function runPromise
	 * @param {string} command - Command to run.
	 * @param {object} [options={}] - Options.
	 * @param {string} [options.ignoreError=''] - Error message string to ignore.
	 * @param {boolean} [options.silent=false] - Silence all errors.
	 * @returns {Promise<{error: string, stdout: string, stderr: string}>} Terminal outputs.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Run a command in sync mode and get its output.
	 *
	 * @function runAndRead
	 * @param {string} command - Command to run.
	 * @returns {string} Output.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Run a command in sync mode and get its output line by line, by excluding empty lines.
	 *
	 * @function runAndReadLines
	 * @param {string} command - Command to run.
	 * @returns {Array<string>} Output.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Run a command in sync mode and get its output separated by a slash.
	 *
	 * @function runAndGet
	 * @param {string} command - Command to run.
	 * @returns {string} Output.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Run a command in sync mode and echo its output.
	 *
	 * @function runAndEcho
	 * @param {string} command - Command to run.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print the task to be executed, run the command in sync mode and display a completion box.
	 *
	 * @function runTask
	 * @param {string} title - Title explaining the command.
	 * @param {string} command - Command to run.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Print the script file title to be run, run shell script file in sync mode from configured scripts path and
	 * given file with given parameters and display a completion box.
	 *
	 * @function runScript
	 * @param {string} file - Script filename under path defined via setScriptsFiles.
	 * @param {...string} [options] - Arguments to pass to the script.
	 * @returns {console.services.Terminal} Terminal instance.
	 * @memberof console.services.Terminal
	 * @instance
	 */

	/**
	 * Get the currently executed file. By default, should be "ioc".
	 *
	 * @type {string}
	 */
	get file() {
		return process.argv[1];
	}

	/**
	 * Get the process argv.
	 *
	 * @type {Array<string>}
	 */
	get argv() {
		return process.argv.slice(2);
	}

	/**
	 * Get the current console command.
	 *
	 * @type {string}
	 */
	get command() {
		return this.argv.join(' ');
	}

	/**
	 * Get the current console command arguments.
	 *
	 * @returns {string} The arguments.
	 */
	get args() { // eslint-disable-line unicorn/prevent-abbreviations
		return this.argv.slice(1).join(' ');
	}

	/**
	 * The inquirer module.
	 *
	 * @type {Inquirer}
	 */
	get inquirer() {
		return require('inquirer'); // eslint-disable-line global-require
	}

	/**
	 * Spawn a process as a promise.
	 *
	 * @param {string} command - The command to run.
	 * @param {Array<string>} parameters - The command arguments.
	 * @param {object} options - The spawn options.
	 * @returns {Promise} The async process promise.
	 */
	async spawn(command, parameters, options) {
		await new Promise((resolve, reject) => {
			this.crossSpawn(command, parameters, options)
				.on('close', (code) => {
					if (code === 0) {
						resolve();
					} else {
						reject(code);
					}
				});
		});
	}

	/**
	 * Spawn a process in sync mode.
	 *
	 * @param {string} command - The command to run.
	 * @param {Array<string>} parameters - The command arguments.
	 * @param {object} options - The spawn options.
	 */
	spawnSync(command, parameters, options) {
		this.crossSpawn.sync(command, parameters, options);
	}

	/**
	 * The cross-spawn module.
	 *
	 * @type {spawn}
	 */
	get crossSpawn() {
		return require('cross-spawn'); // eslint-disable-line global-require
	}

	/**
	 * Ask a question to the user.
	 *
	 * @param {string} question - The question to ask.
	 * @param {string|null} defaultAnswer - The default answer.
	 * @param {object} options - The inquirer options.
	 * @returns {Promise<string|null>} The user answer.
	 */
	async ask(question, defaultAnswer = null, options = {}) {
		const { answer } = await this.inquirer.prompt({
			'message': question,
			'name':    'answer',
			'type':    'input',
			'default': defaultAnswer,
			...options
		});

		return answer;
	}

	/**
	 * Ask a question to the user with a secret answer.
	 *
	 * @param {string} question - The question to ask.
	 * @param {object} [options={}] - The inquirer options.
	 * @returns {Promise<string|null>} The user answer.
	 */
	secret(question, options = {}) {
		return this.ask(question, null, { ...options, type: 'password' });
	}

	/**
	 * Ask the user to confirm an action.
	 *
	 * @param {string} statement - The confirmation statement.
	 * @param {boolean} [defaultValue=false] - The default confirmation value.
	 * @returns {Promise<boolean>} The user confirmation.
	 */
	async confirm(statement, defaultValue = false) {
		const answer = await this.ask(statement, Boolean(defaultValue), { type: 'confirm' });

		return Boolean(answer);
	}

	/**
	 * Ask a question with a list of potential answers to the user.
	 *
	 * @param {string} question - The question to ask.
	 * @param {Array<string>|object<string, string>} choices - The available choices.
	 * @param {string} [defaultValue] - The default value.
	 * @returns {Promise<string>} The user answer.
	 */
	async choice(question, choices, defaultValue = '') {
		const choicesKeys   = Array.isArray(choices) ? choices : Object.keys(choices);
		const choicesValues = Array.isArray(choices) ? choices : Object.values(choices);

		const answer = await this.ask(question, defaultValue, {
			type:    'list',
			choices: choicesValues
		});

		return choicesKeys[choicesValues.indexOf(answer)];
	}

	/**
	 * Print a table with list of models.
	 *
	 * @param {Array<string>} header - The table header.
	 * @param {Array<object<string,string>>} data - The table data.
	 * @param {object} [options={}] - The table options.
	 * @param {boolean} [print=true] - Indicates if the table should be printed or returned as a string.
	 * @returns {console.services.Terminal|string} Either the terminal or the table as string.
	 */
	table(header, data, options = {}, print = true) {
		const { table }      = require('table'); // eslint-disable-line global-require
		const dataIsMainData = data && Array.isArray(data);
		const headerData     = dataIsMainData && header.length !== 0 ? [header, new Array(header.length)] : [];
		const tableData      = dataIsMainData ? data : header;
		const optionData     = (typeof options === 'object' ? options : null) || data || {};
		const defaultOptions = {};

		const result = table(headerData.concat(tableData), Object.assign(defaultOptions, optionData))
			.replace(/\n. (?![a-zA-Z0-9]+).*\n/gu, '\n');

		return print ? this.print(result) : result;
	}

	/**
	 * Print multiple tables.
	 *
	 * @param {Array<Array<Array<string>>>} tables - The tables.
	 * @param {boolean} [sideBySide=false] - Indicates that the tables should be side by side instead on one under the other.
	 * @param {object} [options={}] - The table options.
	 * @param {boolean} [print=true] - Indicates if the table should be printed or returned as a string.
	 * @returns {console.services.Terminal|string} Either the terminal or the table as string.
	 */
	tables(tables, sideBySide = false, options = {}, print = true) {
		const results = tables.map((data) => {
			return this.table([], data, options, false);
		});

		let text;

		if (sideBySide) {
			text = '';

			const splitResults = results.map((result) => {
				return result.split('\n');
			});
			const higherLength = splitResults.reduce((l, { length }) => {
				return l < length ? length : l;
			}, 0);

			for (let i = 0; i < higherLength; i++) {
				splitResults.forEach((rows, index) => {  // eslint-disable-line no-loop-func
					const width = rows[0].length;
					text += `${index > 0 ? '\t' : ''}${rows[i] || new Array(width).map(() => {
						return ' ';
					}).join('')}`;
				});
				text += '\n';
			}
			text = `${text.trim()}\n`;
		} else {
			text = results.join('\n');
		}

		return print ? this.print(text) : text;
	}

}


export default Terminal;
