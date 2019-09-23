//--------------------------------------------------------
//-- Tests - Unit - Security - Services - Gate
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Gate.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.gateService();
	given.noSpies();
	given.emptyResult();
});


test('Can run gate test with one policy that should pass', () => {
	given.passingDefaultPolicy();
	when.testingDefaultPolicy();
	then.shouldHavePassedGate();
});

test('Can run gate test with one policy that should not pass', () => {
	given.denyingDefaultPolicy();
	when.testingDefaultPolicy();
	then.shouldNotHavePassedGate();
});

test('Can run gate test with two policies that pass and pass', () => {
	given.passingPolicy('foo');
	given.passingPolicy('bar');
	when.testingPolicies(['foo', 'bar']);
	then.shouldHavePassedGate();
});

test('Can run gate test with one passing policy and one denying policy and be denied', () => {
	given.passingPolicy('foo');
	given.denyingPolicy('bar');
	when.testingPolicies(['foo', 'bar']);
	then.shouldNotHavePassedGate();
});

test('Can run gate test with one denying and one passing policies and be denied', () => {
	given.denyingPolicy('bar');
	given.passingPolicy('foo');
	when.testingPolicies(['foo', 'bar']);
	then.shouldNotHavePassedGate();
});


test('Can run gate test with two policies that deny and be denied', () => {
	given.denyingPolicy('foo');
	given.denyingPolicy('bar');
	when.testingPolicies(['foo', 'bar']);
	then.shouldNotHavePassedGate();
});


test('Can register two passing policy handlers and pass', () => {
	given.passingDefaultPolicy();
	given.passingDefaultPolicy();
	when.testingDefaultPolicy();
	then.shouldHavePassedGate();
});

test('Can register one passing and one denying policy handlers and be denied', () => {
	given.passingDefaultPolicy();
	given.denyingDefaultPolicy();
	when.testingDefaultPolicy();
	then.shouldNotHavePassedGate();
});

test('Can register one denying and one passing policy handlers and be denied', () => {
	given.denyingDefaultPolicy();
	given.passingDefaultPolicy();
	when.testingDefaultPolicy();
	then.shouldNotHavePassedGate();
});

test('Can register two denying policy handlers and be denied', () => {
	given.denyingDefaultPolicy();
	given.denyingDefaultPolicy();
	when.testingDefaultPolicy();
	then.shouldNotHavePassedGate();
});

test('Can handle argument', () => {
	given.passingPolicy('foo');
	when.testingPolicy('foo:bar');
	then.shouldHavePassedGate();
	then.policyShouldHaveReceivedArguments('bar');
});

test('Can handle multiple arguments', () => {
	given.passingPolicy('foo');
	when.testingPolicy('foo:bar,baz,test');
	then.shouldHavePassedGate();
	then.policyShouldHaveReceivedArguments('bar', 'baz', 'test');
});
