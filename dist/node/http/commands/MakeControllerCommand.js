//--------------------------------------------------------
//-- Node IoC - HTTP - Command - Make Controller
//--------------------------------------------------------
'use strict';

const GeneratorCommand = require('../../console/GeneratorCommand');
/**
 * Command that makes a controller class file inside the application controllers folder.
 *
 * @memberof http.commands
 * @augments console.GeneratorCommand
 * @hideconstructor
 */


class MakeControllerCommand extends GeneratorCommand {
  /**
   * Class dependencies.
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
    return ['env:local', 'http'];
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
    return this.app.controllerPath();
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['resource', 'Generate a resource controller class.'], ['api', 'Generate an API resource controller class, without "create" and "edit" actions.'], ['handler', 'Generate a single method handler controller class.']];
  }
  /**
   * @inheritdoc
   */


  get patterns() {
    const baseControllerPath = this.app.formatPath(this.pathHelper.relative(this.pathHelper.dirname(this.getDestination()), this.app.controllerPath('Controller')));
    return {
      BASE_CONTROLLER_PATH: baseControllerPath.startsWith('.') ? baseControllerPath : `./${baseControllerPath}`
    };
  }
  /**
   * @inheritdoc
   */


  async handle() {
    const type = this.getType();
    this.debug(`Generating ${this.parameter('class')} ${type} controller file.`);
    await this.generate(type);
    this.info(`${this.parameter('class')} ${type} controller file successfully generated!`);
  }
  /**
   * Get controller type.
   *
   * @returns {string} - The file type.
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
   * @type {PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

}

module.exports = MakeControllerCommand;