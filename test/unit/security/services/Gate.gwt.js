//--------------------------------------------------------
//-- Tests - Unit - Security - Services - Gate - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./../common.gwt');

const container = require('../../container');
const Gate      = require('../../../../dist/node/security/services/Gate');

let gate;
let result;
let handlers = [];


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.noSpies = () => {
	handlers = [];
};

given.gateService = () => {
	gate = container.make(Gate);
};

given.policy = (name, handler) => {
	const spiedHandler = jest.fn((...parameters) => {
		return handler(...parameters);
	});
	handlers.push(spiedHandler);
	gate.policy(name, spiedHandler);
};

given.passingPolicy = (name) => {
	given.policy(name, () => { return true; });
};

given.denyingPolicy = (name) => {
	given.policy(name, () => { return false; });
};

given.passingDefaultPolicy = () => {
	given.passingPolicy('default');
};

given.denyingDefaultPolicy = () => {
	given.denyingPolicy('default');
};


//-- When
//--------------------------------------------------------

when.testingPolicy = (policy) => {
	when.attempting(() => {
		result = gate.can(policy);
	});
};

when.testingDefaultPolicy = () => {
	when.testingPolicy('default');
};

when.testingPolicies = (policies) => {
	when.testingPolicy(policies);
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHavePassedGate = () => {
	then.resultShouldBe(true);
};

then.shouldNotHavePassedGate = () => {
	then.resultShouldBe(false);
};

then.lastHandlerShouldHaveBeenCalledTimes = (times) => {
	then.shouldNotHaveThrown();
	expect(handlers.length).toBeGreaterThan(0);
	expect(handlers[handlers.length - 1]).toHaveBeenCalledTimes(times);
};

then.lastHandlerShouldHaveBeenCalled = () => {
	then.lastHandlerShouldHaveBeenCalledTimes(1);
};

then.lastHandlerShouldNotHaveBeenCalled = () => {
	then.lastHandlerShouldHaveBeenCalledTimes(0);
};

then.policyShouldHaveReceivedArguments = (...parameters) => {
	handlers.forEach((handler) => {
		expect(handler).toHaveBeenCalled();
		expect(handler).toHaveBeenCalledWith(...parameters);
	});
};


module.exports = build({ given, when, then });
