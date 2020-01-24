//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Environment Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container          from '../../container';
import EnvironmentCommand from '../../../../dist/node/console/commands/EnvironmentCommand';


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
	then.shouldHaveTranslated('commands.env.messages.current', { name: 'fake' });
	then.shouldHaveOutput('commands.env.messages.current {"name":"fake"}');
};


export default build({ given, when, then });
