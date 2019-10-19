//--------------------------------------------------------
//-- Tests - Unit - Translation - Translation Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';

let result;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.callingLangPathMethodOnContainer = () => {
	when.attempting(() => {
		result = container.langPath();
	});
};


//-- Then
//--------------------------------------------------------

then.translatorServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('translator');
};

then.translatorServiceIsSingleton = () => {
	then.shouldHaveSingleton('translator');
};

then.langPathIsResolvable = () => {
	then.serviceShouldBeResolvable('path.lang');
};

then.resultShouldBeLangPath = () => {
	then.shouldNotHaveThrown();
	expect(result).toBe(container.make('path.lang'));
};


export default build({ given, when, then });
