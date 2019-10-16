//--------------------------------------------------------
//-- Tests - Unit - View - Services - Resolver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const path      = require('path');
const container = require('../../container');
const Resolver  = require('../../../../dist/node/view/services/Resolver');

let resolver;
let viewName;
let result;


//-- Given
//--------------------------------------------------------

given.stubsViewPath = () => {
	container.configurePaths({ view: path.join(__dirname, '..', 'stubs', 'views') });
};

given.resolver = () => {
	resolver = container.make(Resolver, { app: container });
};

given.viewName = (name) => {
	viewName = name;
};

given.namespace = () => {
	resolver.namespace('namespace', container.viewPath('namespace'));
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.gettingResolverPath = () => {
	when.attempting(() => {
		result = resolver.path;
	});
};

when.findingView = () => {
	when.attempting(() => {
		result = resolver.find(viewName);
	});
};


//-- Then
//--------------------------------------------------------


then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReceivedStubsViewPath = () => {
	then.resultShouldBe(container.viewPath());
};


module.exports = build({ given, when, then });
