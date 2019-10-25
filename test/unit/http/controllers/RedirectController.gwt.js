//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Redirect Controller - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container          from '../../container';
import RedirectController from '../../../../dist/node/http/controllers/RedirectController';

let redirectController;


//-- Mocks
//--------------------------------------------------------

const fakeRequest = {};
const fakeResponse = {
	redirect: jest.fn(() => { return fakeResponse; })
};


//-- Given
//--------------------------------------------------------

given.redirectController = () => {
	redirectController = container.make(RedirectController);
	redirectController.prepareHandling(container, fakeRequest, fakeResponse);
};


//-- When
//--------------------------------------------------------

when.redirecting = () => {
	when.attempting(() => {
		redirectController.handle({ to: '/new/path' });
	});
};

when.redirectingPermanently = () => {
	when.attempting(() => {
		redirectController.handle({ to: '/new/path', permanent: true });
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveRedirectTemporarily = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.redirect).toHaveBeenCalledWith(302, '/new/path');
};

then.shouldHaveRedirectPermanently = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.redirect).toHaveBeenCalledWith(301, '/new/path');
};


export default build({ given, when, then });
