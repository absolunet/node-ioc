//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Environment Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container          = require('../../container');
const EnvironmentCommand = require('../../../../src/console/commands/EnvironmentCommand');


//-- Given
//--------------------------------------------------------

given.environmentCommand = () => {
	given.command(EnvironmentCommand);
};

given.fakeEnvironmentInContainer = () => {
	container.setEnvironment('fake');
};


//-- Then
//--------------------------------------------------------

then.shouldHaveReceivedFakeEnvironment = () => {
	then.shouldHaveOutput('Current application environment: "fake"');
};


module.exports = build({ given, when, then });
