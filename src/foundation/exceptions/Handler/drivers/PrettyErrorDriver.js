//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler - Drivers - Pretty Error Driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * Pretty Error exception render driver.
 */
class PrettyErrorDriver extends Driver {

	/**
	 * Class dependencies: <code>['terminal']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		const { PrettyError } = this;
		this.setEngine(new PrettyError());
	}

	/**
	 * Set engine styles.
	 */
	setEngineStyles() {
		const headerStyle = {
			color: 'bright-white',
			background: 'red',
			paddingTop: 1,
			paddingBottom: 1
		};

		const [textColor] = this.terminal.defaults.textColor._styles;

		const colorName = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey', 'blackBright', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright', 'whiteBright'].find((name) => {
			return this.terminal.chalk[name] && this.terminal.chalk[name]._styles[0] === textColor;
		}) || 'yellowBright';

		const prettyColorAccentColorName = this.stringHelper.slug(colorName).split('-').reverse().join('-');

		this.engine.appendStyle({
			'pretty-error': {
				paddingLeft: this.terminal.defaults.indent
			},
			'pretty-error > header > title > kind': {
				...headerStyle,
				paddingLeft: 2
			},
			'pretty-error > header > colon': {
				...headerStyle,
				marginRight: 0
			},
			'pretty-error > header > message': {
				...headerStyle,
				paddingLeft: 1,
				paddingRight: 2
			},
			'pretty-error > trace > item > header > pointer > file': {
				color: prettyColorAccentColorName
			},

			'pretty-error > trace > item > header > pointer > line': {
				color: prettyColorAccentColorName,
				marginRight: 1
			}
		});
	}

	/**
	 * @inheritdoc
	 */
	render(exception) {
		this.setEngineStyles();
		this.terminal.spacer();
		this.terminal.echo(this.engine.render(exception));
	}

	/**
	 * String helper.
	 *
	 * @type {support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.app.make('helper.string');
	}

	/**
	 * Terminal.
	 *
	 * @type {console.services.Terminal}
	 */
	get terminal() {
		return this.app.make('terminal');
	}

	/**
	 * The pretty-error module.
	 *
	 * @type {PrettyError}
	 */
	get PrettyError() {
		return require('pretty-error'); // eslint-disable-line global-require
	}

}


export default PrettyErrorDriver;
