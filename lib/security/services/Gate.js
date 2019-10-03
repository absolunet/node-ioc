//--------------------------------------------------------
//-- Node IoC - Security - Services - Gate
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const checksTypes = require('../../support/mixins/checksTypes');


class Gate extends checksTypes() {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('policies', {});
	}

	/**
	 * Determine if the user is authorized to get through the given gates.
	 *
	 * @param {string|Array<string>} gate
	 * @returns {boolean}
	 */
	can(gate) {
		const gates = Array.isArray(gate) ? gate : [gate];

		return gates.every((g) => {
			const { args, policies } = this.resolve(g);

			return policies.every((policy) => {
				return this.handlePolicy(policy, args);
			});
		});
	}

	/**
	 * Register policy.
	 *
	 * @param {string} policy
	 * @param {Function} handler
	 */
	policy(policy, handler) {
		const policies = __(this).get('policies');
		policies[policy] = policies[policy] || [];

		policies[policy].push(handler);
	}

	/**
	 * Resolve policy handlers by name.
	 *
	 * @param {string} gate
	 * @returns {{name: string, args: Array<string>, policies: Array<Function|*>}}
	 */
	resolve(gate) {
		const name = this.getGateName(gate);
		const args = this.getGateArguments(gate); // eslint-disable-line unicorn/prevent-abbreviations
		const policies = (__(this).get('policies')[name] || [])
			.map((policy) => {
				return this.getPolicyConcrete(policy);
			});

		return { name, args, policies };
	}

	/**
	 * Get the gate name, without arguments.
	 *
	 * @param {string} gate
	 * @returns {string}
	 */
	getGateName(gate) {
		return gate.split(':')[0];
	}

	/**
	 * Get gate arguments from string call.
	 *
	 * @param {string} gate
	 * @returns {Array<string>}
	 */
	getGateArguments(gate) {
		return (gate.split(':')[1] || '').split(',').filter((argument) => { return argument; });
	}

	/**
	 * Get policy handler instance, either a closure or a policy class instance.
	 * @param policy
	 * @returns {Container|*}
	 */
	getPolicyConcrete(policy) {
		return this.isFunction(policy) ? policy : this.app.make(policy);
	}

	/**
	 * Execute policy handling, either from a closure or a class instance.
	 *
	 * @param {Function|*} policy
	 * @param {Array<string>} parameters
	 * @returns {boolean}
	 */
	handlePolicy(policy, parameters = []) {
		return this.isFunction(policy) ? policy(...parameters) : policy.handle(...parameters);
	}

}


module.exports = Gate;
