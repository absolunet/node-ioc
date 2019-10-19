//--------------------------------------------------------
//-- Tests - Unit - Support - Support Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


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

then.fakerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('faker');
};

then.fakerShouldBeSingleton = () => {
	then.shouldHaveSingleton('faker');
};


export default build({ given, when, then });
