//--------------------------------------------------------
//-- Tests - Unit - View - Services - Resolver - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import * as path from 'path';
import container from '../../container';
import Resolver  from '../../../../dist/node/view/services/Resolver';

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
		result = resolver.getBasePaths();
	});
};

when.findingView = () => {
	when.attempting(() => {
		result = resolver.find(viewName);
	});
};

when.checkingIfViewExists = () => {
	when.attempting(() => {
		result = resolver.exists(viewName);
	});
};


//-- Then
//--------------------------------------------------------


then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReceivedStubsViewPath = () => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual([container.viewPath()]);
};


export default build({ given, when, then });
