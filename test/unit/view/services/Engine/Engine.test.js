//--------------------------------------------------------
//-- Tests - Unit - View - Services - Engine
//--------------------------------------------------------

import gwt from './Engine.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.engine();
	given.fakeDriver();
});


test('Can make template instance', () => {
	when.makingViewInstance();
	then.shouldReturnDriverResultFromMakeMethod();
});

test('Can render template instance', () => {
	when.renderingView();
	then.shouldReturnDriverResultFromRenderMethod();
});

test('Can render template instance with view-model', () => {
	when.renderingViewWithViewModel();
	then.shouldReturnDriverResultFromRenderMethodWithViewModel();
});
