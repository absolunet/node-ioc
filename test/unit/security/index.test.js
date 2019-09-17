//--------------------------------------------------------
//-- Tests - Unit - Security
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');

const container               = require('../common');
const SecurityServiceProvider = require('../../../lib/security/SecurityServiceProvider');


describe('Node IoC - Security', () => {

	beforeEach(() => {
		container.register(SecurityServiceProvider);
		container.bootIfNotBooted();
	});


	test('Gate service is resolvable', () => {
		expect(container.isBound('gate')).toBe(true);
		expect(container.make('gate')).toBeTruthy();
	});


	describe('Policies', () => {

		let gate;

		const getPoliciesCount = () => {
			return Object.keys(__(gate).get('policies')).length;
		};


		beforeEach(() => {
			gate = container.make('gate');
		});


		test('Gate service is a singleton', () => {
			expect(gate).toBe(container.make('gate'));
		});

		test('Can register policies', () => {

			const policiesCount = getPoliciesCount();

			gate.policy('test', () => {
				return true;
			});
			expect(getPoliciesCount()).toBe(policiesCount + 1);
			expect(gate.can('test')).toBe(true);

			gate.policy('other-test', () => {
				return false;
			});
			expect(getPoliciesCount()).toBe(policiesCount + 2);
			expect(gate.can('other-test')).toBe(false);

			expect(gate.can(['test', 'other-test'])).toBe(false);
		});

		test('Can register multiple policy handlers', () => {
			const policiesCount = getPoliciesCount();

			gate.policy('test', () => {
				return true;
			});

			expect(getPoliciesCount()).toBe(policiesCount + 1);
			expect(gate.can('test')).toBe(true);

			gate.policy('test', () => {
				return false;
			});

			expect(getPoliciesCount()).toBe(policiesCount + 1);
			expect(gate.can('test')).toBe(false);

			gate.policy('test', () => {
				return true;
			});

			expect(getPoliciesCount()).toBe(policiesCount + 1);
			expect(gate.can('test')).toBe(false);
		});

		test('Can handle arguments', () => {
			gate.policy('test', (type) => {
				return ['case'].includes(type);
			});

			expect(gate.can('test')).toBe(false);
			expect(gate.can('test:case')).toBe(true);
			expect(gate.can('test:foo')).toBe(false);

			gate.policy('other-test', (...parameters) => {
				const validParameters = ['foo', 'bar', 'baz'];

				return parameters.length === 0 || parameters.every((parameter) => {
					return validParameters.includes(parameter);
				});
			});

			expect(gate.can('other-test')).toBe(true);
			expect(gate.can('other-test:foo')).toBe(true);
			expect(gate.can('other-test:bar')).toBe(true);
			expect(gate.can('other-test:baz')).toBe(true);
			expect(gate.can('other-test:test')).toBe(false);
			expect(gate.can('other-test:foo,bar')).toBe(true);
			expect(gate.can('other-test:foo,baz')).toBe(true);
			expect(gate.can('other-test:bar,baz')).toBe(true);
			expect(gate.can('other-test:foo,bar,baz')).toBe(true);
			expect(gate.can('other-test:foo,bar,test')).toBe(false);
		});
	});

});
