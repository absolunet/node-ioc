//--------------------------------------------------------
//-- Tests - Unit - Support - Support Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.dateHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.date');
};

then.fileHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.file');
};

then.stringHelperShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('helper.string');
};

then.fakerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('faker');
};

then.fakerShouldBeSingleton = () => {
	then.shouldHaveSingleton('faker');
};


module.exports = build({ given, when, then });
