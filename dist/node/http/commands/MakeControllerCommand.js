"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GeneratorCommand = _interopRequireDefault(require("../../console/GeneratorCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Command - Make Controller
//--------------------------------------------------------

/**
 * Command that makes a controller class file inside the application controllers folder.
 *
 * @memberof http.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */
class MakeControllerCommand extends _GeneratorCommand.default {
  /**
   * Class dependencies: <code>['helper.path']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['helper.path']);
  }
  /**
   * @inheritdoc
   */


  get policies() {
    return (super.policies || []).concat(['http']);
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'make:controller';
  }
  /**
   * @inheritdoc
   */


  get files() {
    return {
      api: this.app.formatPath(__dirname, 'stubs', 'ApiResourceController.stub'),
      base: this.app.formatPath(__dirname, 'stubs', 'Controller.stub'),
      handler: this.app.formatPath(__dirname, 'stubs', 'HandlerController.stub'),
      resource: this.app.formatPath(__dirname, 'stubs', 'ResourceController.stub')
    };
  }
  /**
   * @inheritdoc
   */


  get destination() {
    return this.app.sourcePath('controller', '');
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['resource', this.t('commands.make-controller.flags.resource')], ['api', this.t('commands.make-controller.flags.api')], ['handler', this.t('commands.make-controller.flags.handler')]];
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    const baseControllerPath = this.app.formatPath(this.pathHelper.relative(this.pathHelper.dirname(this.getDestination()), this.app.sourcePath('controller', 'Controller')));
    return {
      BASE_CONTROLLER_PATH: baseControllerPath.startsWith('.') ? baseControllerPath : `./${baseControllerPath}`
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const type = this.getType();
    const name = this.parameter('class');
    this.debug(this.t('commands.make-controller.messages.generating', {
      type,
      name
    }));
    await this.generate(type);
    this.info(this.t('commands.make-controller.messages.success', {
      type,
      name
    }));
  }
  /**
   * Get controller type.
   *
   * @returns {string} The file type.
   */


  getType() {
    if (this.flag('resource')) {
      return 'resource';
    }

    if (this.flag('api')) {
      return 'api';
    }

    if (this.flag('handler')) {
      return 'handler';
    }

    return 'base';
  }
  /**
   * Path helper.
   *
   * @type {support.helpers.PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

}

var _default = MakeControllerCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;