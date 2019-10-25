//--------------------------------------------------------
//-- Tests - Unit - Application - Main
//--------------------------------------------------------

import gwt from './main.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
});


test('All framework accessible classes are working', () => {
	given.mainFile();
	when.gettingAllKeysExceptApplicationAndMixins();
	then.allKeysShouldBeConstructor();
});

test('All exposed mixins are class factories', () => {
	given.mainFile();
	when.gettingMixinsWithoutFactory();
	then.allKeysShouldFactoryConstructor();
});
