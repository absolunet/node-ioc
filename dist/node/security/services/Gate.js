"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _checksTypes = _interopRequireDefault(require("../../support/mixins/checksTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Security - Services - Gate
//--------------------------------------------------------

/**
 * Gate service that allows to register policies and test those policies before executing command or anything that needs security checks.
 *
 * @memberof security.services
 * @augments support.mixins.CheckTypes
 * @hideconstructor
 */
class Gate extends (0, _checksTypes.default)() {
  /**
   * Class dependencies: <code>['app']</code>.
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
    (0, _privateRegistry.default)(this).set('policies', {});
  }
  /**
   * Determine if the user is authorized to get through the given gates.
   *
   * @param {string|Array<string>} gate - Gate to validate through registered policies.
   * @returns {boolean} Indicates that the policies passed.
   */


  can(gate) {
    const gates = Array.isArray(gate) ? gate : [gate];
    return gates.every(g => {
      const {
        parameters,
        policies
      } = this.resolve(g);
      return policies.every(policy => {
        return this.handlePolicy(policy, parameters);
      });
    });
  }
  /**
   * Register policy.
   *
   * @param {string} policy - The policy name.
   * @param {Function} handler - The policy handler.
   */


  policy(policy, handler) {
    const policies = (0, _privateRegistry.default)(this).get('policies');
    policies[policy] = policies[policy] || [];
    policies[policy].push(handler);
  }
  /**
   * Register policy class.
   *
   * @param {ioc.security.Policy} policy - The policy class.
   */


  register(policy) {
    const policyInstance = this.app.make(policy);
    this.policy(policyInstance.name, (...parameters) => {
      return policyInstance.passes(...parameters);
    });
  }
  /**
   * Resolve policy handlers by name.
   *
   * @param {string} gate - The gate to resolve.
   * @returns {{name: string, parameters: Array<string>, policies: Array<Function|*>}} The resolved gate name, parametres and policies.
   */


  resolve(gate) {
    const name = this.getGateName(gate);
    const parameters = this.getGateParameters(gate);
    const policies = ((0, _privateRegistry.default)(this).get('policies')[name] || []).map(policy => {
      return this.getPolicyConcrete(policy);
    });
    return {
      name,
      parameters,
      policies
    };
  }
  /**
   * Get the gate name, without arguments.
   *
   * @param {string} gate - The gate.
   * @returns {string} The gate name.
   */


  getGateName(gate) {
    return gate.split(':')[0];
  }
  /**
   * Get gate arguments from string call.
   *
   * @param {string} gate - The gate.
   * @returns {Array<string>} The list of parameters.
   */


  getGateParameters(gate) {
    return (gate.split(':')[1] || '').split(',').filter(Boolean);
  }
  /**
   * Get policy handler instance, either a closure or a policy class instance.
   *
   * @param {*} policy - The policy or policy class.
   * @returns {Function|Policy} The policy callable function or class instance.
   */


  getPolicyConcrete(policy) {
    return this.isFunction(policy) ? policy : this.app.make(policy);
  }
  /**
   * Execute policy handling, either from a closure or a class instance.
   *
   * @param {Function} policy - The policy callable function or class instance.
   * @param {Array<string>} parameters - The list of parameters.
   * @returns {boolean} Indicates if the given policy passes with the given parameters.
   */


  handlePolicy(policy, parameters = []) {
    return this.isFunction(policy) ? policy(...parameters) : policy.handle(...parameters);
  }

}

var _default = Gate;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;