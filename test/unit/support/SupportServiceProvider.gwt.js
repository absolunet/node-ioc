//--------------------------------------------------------
//-- Tests - Unit - Support - Support Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';


//-- Mocks
//--------------------------------------------------------

const fakeViewResolver = {
	namespace: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.fakeViewResolver = () => {
	container.singleton('view.resolver', fakeViewResolver);
};


//-- Then
//--------------------------------------------------------

then.dateHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.date');
};

then.fileHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.file');
};

then.pathHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.path');
};

then.stringHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.string');
};

then.dumperServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('dumper');
};

then.dumperServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('dumper');
};

then.fakerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('faker');
};

then.fakerShouldBeSingleton = () => {
	then.shouldHaveSingleton('faker');
};

then.dumperViewNamespaceShouldBeCreated = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewResolver.namespace).toHaveBeenCalledTimes(1);
	expect(fakeViewResolver.namespace.mock.calls[0][0]).toBe('dumper');
	expect(fakeViewResolver.namespace.mock.calls[0][1]).toMatch(/support\/views\/dumper$/u);
};


export default build({ given, when, then });
