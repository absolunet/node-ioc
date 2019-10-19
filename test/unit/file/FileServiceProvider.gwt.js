//--------------------------------------------------------
//-- Tests - Unit - File - File Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


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


export default build({ given, when, then });
