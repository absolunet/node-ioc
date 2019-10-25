//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler drivers - Pretty Error Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container         from '../../../../container';
import ViewDriver        from '../../../../../../dist/node/foundation/exceptions/Handler/drivers/ViewDriver';

let viewDriver;
let exception;
let request;
let response;
let fakeViews;
let fakeTranslations;


//-- Mocks
//--------------------------------------------------------

const fakeException      = new TypeError('An error has occurred...');

const notFoundException  = new TypeError('Not Found.');
notFoundException.status = 404;

const fakeViewFactory = {
	make: jest.fn((name) => {
		return fakeViews[name];
	})
};

const fakeViewResolver = {
	exists: jest.fn((name) => {
		return Boolean(fakeViews[name]);
	})
};

const fakeTranslator = {
	translate: jest.fn((key) => {
		return fakeTranslations[key] || key;
	})
};

const fakeRequest = {};

const fakeResponse = {
	end: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.bootedContainer = () => {
	container.bootIfNotBooted();
};

given.fakeViewFactory = () => {
	container.singleton('view', fakeViewFactory);
	fakeViews = {};
};

given.fakeViewResolver = () => {
	container.singleton('view.resolver', fakeViewResolver);
};

given.fakeTranslator = () => {
	container.singleton('translator', fakeTranslator);
	fakeTranslations = {
		'Something went wrong...': 'Translated message'
	};
};

given.exception = () => {
	exception = fakeException;
};

given.notFoundException = () => {
	exception = notFoundException;
};

given.fakeRequest = () => {
	request = fakeRequest;
};

given.fakeResponse = () => {
	response = fakeResponse;
};

given.viewDriver = () => {
	viewDriver = container.make(ViewDriver);
};

given.view = (name, content) => {
	fakeViews[`errors.${name}`] = content;
};

given.genericView = () => {
	given.view('generic', 'Generic content');
};

given.notFoundView = () => {
	given.view('404', 'Not found content');
};


//-- When
//--------------------------------------------------------

when.renderingException = () => {
	when.attempting(() => {
		viewDriver.render(exception, request, response);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveSentResponseWith = (content) => {
	then.shouldNotHaveThrown();
	expect(response.end).toHaveBeenCalledTimes(1);
	expect(response.end).toHaveBeenCalledWith(content);
};

then.shouldNotHaveRenderedView = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewFactory.make).not.toHaveBeenCalled();
};

then.shouldHaveRenderedView = (view) => {
	then.shouldNotHaveThrown();
	expect(fakeViewFactory.make).toHaveBeenCalledTimes(1);
	expect(fakeViewFactory.make).toHaveBeenCalledWith(view, { exception });
	then.shouldHaveSentResponseWith(fakeViewFactory.make.mock.results[0].value);
};

then.shouldHaveRenderedGenericView = () => {
	then.shouldHaveRenderedView('errors.generic');
};

then.shouldHaveRenderedNotFoundView = () => {
	then.shouldHaveRenderedView('errors.404');
};

then.shouldHaveRenderedText = (text) => {
	then.shouldNotHaveRenderedView();
	then.shouldHaveSentResponseWith(text);
};

then.shouldHaveRenderedDefaultText = () => {
	then.shouldHaveRenderedText('Something went wrong...');
};

then.shouldHaveRenderedTranslatedText = () => {
	then.shouldHaveRenderedText('Translated message');
	expect(fakeTranslator.translate).toHaveBeenCalledWith('Something went wrong...');
};


export default build({ given, when, then });
