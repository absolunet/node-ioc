"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _MakeMixinCommand = _interopRequireDefault(require("./commands/MakeMixinCommand"));

var _VendorPublishCommand = _interopRequireDefault(require("./commands/VendorPublishCommand"));

var _DateHelper = _interopRequireDefault(require("./helpers/DateHelper"));

var _FileHelper = _interopRequireDefault(require("./helpers/FileHelper"));

var _PathHelper = _interopRequireDefault(require("./helpers/PathHelper"));

var _StringHelper = _interopRequireDefault(require("./helpers/StringHelper"));

var _Dumper = _interopRequireDefault(require("./services/Dumper"));

var _Faker = _interopRequireDefault(require("./services/Faker"));

var _IdeLink = _interopRequireDefault(require("./enums/IdeLink"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------
// eslint-disable-next-line jsdoc/require-description-complete-sentence

/**
 * The support service provider.
 * It bind these service:
 * <ul>
 *     <li><a href="support.helpers.DateHelper.html">helper.date</a></li>
 *     <li><a href="support.helpers.FileHelper.html">helper.file</a></li>
 *     <li><a href="support.helpers.PathHelper.html">helper.path</a></li>
 *     <li><a href="support.helpers.StringHelper.html">helper.string</a></li>
 *     <li><a href="support.services.Dumper.html">dumper</a></li>
 *     <li><a href="support.services.Faker.html">faker</a></li>
 *     <li><a href="support.enums.IdeLink.html">ide.link</a></li>
 * </ul>
 *
 * @memberof support
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class SupportServiceProvider extends _ServiceProvider.default {
  /**
   * @inheritdoc
   */
  get name() {
    return 'Node IoC - Support';
  }
  /**
   * Register the service provider.
   */


  register() {
    this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
    this.bindDateHelper();
    this.bindFileHelper();
    this.bindPathHelper();
    this.bindStringHelper();
    this.bindDumperService();
    this.bindFakerService();
    this.bindIdeLinkEnum();
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.createDumperViewNamespace();
    this.loadCommands([_MakeMixinCommand.default, _VendorPublishCommand.default]);
  }
  /**
   * Bind date helper.
   */


  bindDateHelper() {
    this.app.bind('helper.date', _DateHelper.default);
  }
  /**
   * Bind file helper.
   */


  bindFileHelper() {
    this.app.bind('helper.file', _FileHelper.default);
  }
  /**
   * Bind path helper.
   */


  bindPathHelper() {
    this.app.bind('helper.path', _PathHelper.default);
  }
  /**
   * Bind string helper.
   */


  bindStringHelper() {
    this.app.bind('helper.string', _StringHelper.default);
  }
  /**
   * Bind dumper service.
   */


  bindDumperService() {
    this.app.singleton('dumper', _Dumper.default);
  }
  /**
   * Bind faker service.
   */


  bindFakerService() {
    this.app.singleton('faker', _Faker.default);
  }
  /**
   * Bind IDE link enum.
   */


  bindIdeLinkEnum() {
    this.app.singleton('ide.link', _IdeLink.default);
  }
  /**
   * Create the dumper service view namespace for HTML rendering.
   */


  createDumperViewNamespace() {
    if (this.app.isBound('view.resolver')) {
      this.app.make('view.resolver').namespace('dumper', this.app.formatPath(__dirname, 'views', 'dumper'));
    }
  }

}

var _default = SupportServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;