//--------------------------------------------------------
//-- Tests - Unit - Translation - Translation Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container = require('../container');

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


module.exports = build({ given, when, then });
