//--------------------------------------------------------
//-- Tests - Unit - File - File Service Provider - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');


//-- Then
//--------------------------------------------------------

then.fileManagerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('file');
};

then.fileManagerShouldBeSingleton = () => {
	then.shouldHaveSingleton('file');
};

then.fileEngineShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('file.engine');
};

then.fileEngineShouldBeSingleton = () => {
	then.shouldHaveSingleton('file.engine');
};

then.asyncFileSystemShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('file.system.async');
};

then.asyncFileSystemShouldBeSingleton = () => {
	then.shouldHaveSingleton('file.system.async');
};

then.syncFileSystemShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('file.system.sync');
};

then.syncFileSystemShouldBeSingleton = () => {
	then.shouldHaveSingleton('file.system.sync');
};


module.exports = build({ given, when, then });
