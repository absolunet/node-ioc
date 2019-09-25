//--------------------------------------------------------
//-- Node IoC - Console - Services - Command Runner
//--------------------------------------------------------
'use strict';


class CommandRunner {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Run command based on argv object.
	 * If an exception occurs, handle it with the application exception handler.
	 *
	 * @param {Command} command
	 * @param {Object<string, string>} argv
	 * @param {Yargs} [yargs]
	 * @returns {Promise<void>}
	 */
	run(command, argv, yargs) {
		return this.unsafeRun(command, argv, yargs)
			.catch(async (error) => {
				if (this.app.isBound('exception.handler')) {
					await this.app.make('exception.handler').handle(error);
				}
			});
	}

	/**
	 * Run command based on argv object.
	 *
	 * @param command
	 * @param argv
	 * @param yargs
	 * @returns {Promise<void>}
	 */
	async unsafeRun(command, argv, yargs) {
		if (yargs) {
			command.setYargs(yargs);
		}

		await this.runPreprocess(command, argv);
		const data = await this.runHandle(command);
		await this.runPostprocess(command, data);
	}

	/**
	 * Run command preprocess.
	 *
	 * @param {Command} command
	 * @param {Object<string, string>} [argv={}]
	 * @returns {Promise<void>}
	 */
	async runPreprocess(command, argv = {}) {
		const preprocessedArgv = await command.preprocess(argv);
		command.setArgv(preprocessedArgv);
	}

	/**
	 * Run command handle method.
	 *
	 * @param {Command} command
	 * @returns {Promise<*>}
	 */
	runHandle(command) {
		if (command.forward) {
			return command.forwardCall(command.forward);
		}

		return command.handle();
	}

	/**
	 * Run command postprocess.
	 *
	 * @param {Command} command
	 * @param {*} data
	 * @returns {Promise<void>}
	 */
	async runPostprocess(command, data) {
		await command.postprocess(data);
	}

}


module.exports = CommandRunner;
