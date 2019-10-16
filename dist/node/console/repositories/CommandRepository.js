"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - CommandRepository
//--------------------------------------------------------

/**
 * Command repository that stores all the register commands through the command registrar.
 *
 * @memberof console.repositories
 * @hideconstructor
 */
class CommandRepository {
  /**
   * Class dependencies: <code>['app', 'terminal', 'yargs']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'terminal', 'yargs'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(this).set('commands', []);

    if (this.app.isBound('gate')) {
      (0, _privateRegistry.default)(this).set('gate', this.app.make('gate'));
    }
  }
  /**
   * Get all commands.
   * Can return either an array of commands or a dictionary associating groups of commands based on names.
   *
   * @param {boolean} [withPolicies] - Use gate service to filter valid commands by policies.
   * @param {boolean} [grouped] - Request grouped command result instead of a single array.
   * @returns {Array<Command>|object<string,Array<Command>>} - The commands or the grouped commands.
   */


  all(withPolicies = true, grouped = false) {
    const gate = (0, _privateRegistry.default)(this).get('gate');
    const commands = (0, _privateRegistry.default)(this).get('commands').filter(({
      policies = []
    }) => {
      return !withPolicies || policies.every(scope => {
        return !gate || gate.can(scope);
      });
    }).sort(({
      name: a
    }, {
      name: b
    }) => {
      return a.localeCompare(b);
    });

    if (!grouped) {
      return commands;
    }

    const groups = {};
    commands.forEach(command => {
      const {
        name
      } = command;

      if (name !== '*') {
        let prefix = name.split(':').shift();
        prefix = prefix === name ? '' : prefix;

        if (!groups[prefix]) {
          groups[prefix] = [];
        }

        groups[prefix].push(command);
      }
    });
    return groups;
  }
  /**
   * Get command by name.
   *
   * @param {string} name - The command name.
   * @returns {Command|null} - The command instance, or null if not found.
   */


  get(name) {
    return (0, _privateRegistry.default)(this).get('commands').find(({
      name: commandName
    }) => {
      return name === commandName;
    }) || null;
  }
  /**
   * Check if command is registered.
   *
   * @param {string} name - The command name.
   * @returns {boolean} - Indicates if the command exists.
   */


  has(name) {
    return Boolean(this.get(name));
  }
  /**
   * Add given command in the command list.
   *
   * @param {Function|Command} command - The command class or instance.
   * @returns {Command} - The command instance.
   */


  add(command) {
    const {
      app,
      terminal,
      yargs
    } = this;
    const instance = app.make(command, {
      app,
      terminal,
      yargs
    });
    (0, _privateRegistry.default)(this).get('commands').push(instance);
    return instance;
  }

}

var _default = CommandRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;