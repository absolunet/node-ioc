//--------------------------------------------------------
//-- Node IoC - HTTP - Command - List
//--------------------------------------------------------

import Command from '../../console/Command';


/**
 * Command that serves the application.
 *
 * @memberof http.commands
 * @augments console.Command
 * @hideconstructor
 */
class ServeCommand extends Command {

	/**
	 * Class dependencies: <code>['server', 'router']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['server', 'router']);
	}

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['http'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'serve';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Serve the application.';
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [
			['port', 8080, 'Port to use to serve the application.']
		];
	}

	/**
	 * @inheritdoc
	 */
	get flags() {
		return [
			['daemon',       'Use a daemon to automatically restart the serve process when a file has changed.'],
			['silent',       'Silently run the process without any console output.'],
			['start-silent', 'Silently start the process, but still output data in the console afterwards.']
		];
	}

	/**
	 * @inheritdoc
	 */
	handle() {
		if (!this.flag('silent') && !this.flag('start-silent')) {
			this.terminal.spacer();
			this.info(`This is serving on port ${this.option('port')}...`);
		}

		if (this.flag('daemon')) {
			return this.startDaemon();
		}

		return this.startServer();
	}

	/**
	 * Start Express server.
	 *
	 * @returns {Promise} The infinite process promise (will never be resolved until the process ends).
	 */
	startServer() {
		const server = this.server.getInstance();

		server.use(this.middleware);
		server.use(this.router.generate());
		server.listen(this.option('port'));

		return this.wait();
	}

	/**
	 * Start daemon server with nodemon.
	 *
	 * @returns {Promise} The nodemon process promise.
	 */
	startDaemon() {
		const commandParts = [
			this.yargs.argv.$0,
			this.name,
			`--port=${this.option('port')}`,
			'--start-silent'
		];

		const silent = this.flag('silent');

		if (silent) {
			commandParts.push('--silent');
		}

		const nodemonProcess = this.nodemon(commandParts.join(' '));

		if (!silent) {
			nodemonProcess.on('restart', () => {
				this.info('Daemon is reloading files...');
			});
		}

		return new Promise((resolve) => {
			nodemonProcess.on('quit', resolve);
		});
	}

	/**
	 * Wait indefinitely.
	 *
	 * @returns {Promise} The infinite process promise (will never be resolved until the process ends).
	 */
	wait() {
		return new Promise(() => {}); // eslint-disable-line no-empty-function
	}

	/**
	 * Express middleware that prints the request in console.
	 *
	 * @type {Function}
	 */
	get middleware() {
		return (request, response, next) => {
			if (!this.flag('silent')) {
				response.on('finish', () => {
					this.terminal.echoIndent(`[${new Date().toLocaleString()}] [${response.statusCode}] ${request.method} ${request.url}`);
				});
			}
			next();
		};
	}

	/**
	 * The nodemon module.
	 *
	 * @type {nodemon}
	 */
	get nodemon() {
		return require('nodemon'); // eslint-disable-line global-require
	}

}


export default ServeCommand;
