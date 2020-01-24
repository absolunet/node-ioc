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
		return this.t('commands.serve.description');
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [
			['port', 8080, this.t('commands.serve.options.port')]
		];
	}

	/**
	 * @inheritdoc
	 */
	get flags() {
		return [
			['daemon',       this.t('commands.serve.flags.daemon')],
			['silent',       this.t('commands.serve.flags.silent')],
			['start-silent', this.t('commands.serve.flags.start-silent')]
		];
	}

	/**
	 * @inheritdoc
	 */
	handle() {
		const port = this.option('port');

		if (!this.flag('silent') && !this.flag('start-silent')) {
			this.terminal.spacer();
			this.info(this.t('commands.serve.messages.starting', { port }));
		}

		if (this.flag('daemon')) {
			return this.startDaemon(port);
		}

		return this.startServer(port);
	}

	/**
	 * Start Express server.
	 *
	 * @param {string|number} port - The HTTP port.
	 * @returns {Promise} The infinite process promise (will never be resolved until the process ends).
	 */
	startServer(port) {
		const server = this.server.getInstance();

		server.use(this.middleware);
		server.use(this.router.generate());
		server.listen(port);

		return this.wait();
	}

	/**
	 * Start daemon server with nodemon.
	 *
	 * @param {string|number} port - The HTTP port.
	 * @returns {Promise} The nodemon process promise.
	 */
	startDaemon(port) {
		const commandParts = [
			this.terminal.file,
			this.name,
			`--port=${port}`,
			'--start-silent'
		];

		const silent = this.flag('silent');

		if (silent) {
			commandParts.push('--silent');
		}

		const nodemonProcess = this.nodemon(commandParts.join(' '));

		if (!silent) {
			nodemonProcess.on('restart', () => {
				this.info(this.t('commands.serve.messages.reloading'));
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
