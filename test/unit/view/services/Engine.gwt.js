//--------------------------------------------------------
//-- Tests - Unit - View - Services - Engine - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const Engine    = require('../../../../lib/view/services/Engine');

let engine;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeDriver = {
	make:   jest.fn(),
	render: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.engine = () => {
	engine = container.make(Engine);
};

given.fakeDriver = () => {
	engine.addDriver('fake', fakeDriver);
	engine.setDefaultDriver('fake');
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.callingMethodOnEngine = (method, parameters = []) => {
	when.attempting(() => {
		result = engine[method](...parameters);
	});
};

when.makingViewInstance = () => {
	when.callingMethodOnEngine('make', ['foo']);
};

when.renderingView = (viewModel) => {
	when.callingMethodOnEngine('render', ['foo', viewModel]);
};

when.renderingViewWithViewModel = () => {
	when.renderingView({ key: 'value' });
};


//-- Then
//--------------------------------------------------------

then.shouldReturnDriverResultFromMethod = (method, parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeDriver[method]).toHaveBeenCalledTimes(1);
	expect(fakeDriver[method]).toHaveBeenCalledWith(...parameters);
	expect(fakeDriver[method]).toHaveReturnedWith(result);
};

then.shouldReturnDriverResultFromMakeMethod = () => {
	then.shouldReturnDriverResultFromMethod('make', ['foo']);
};

then.shouldReturnDriverResultFromRenderMethod = () => {
	then.shouldReturnDriverResultFromMethod('render', ['foo', {}]);
};

then.shouldReturnDriverResultFromRenderMethodWithViewModel = () => {
	then.shouldReturnDriverResultFromMethod('render', ['foo', { key: 'value' }]);
};


module.exports = build({ given, when, then });
