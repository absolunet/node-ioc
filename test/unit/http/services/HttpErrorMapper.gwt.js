//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - HTTP Error Mapper - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container                 from '../../container';
import HttpErrorMapper           from '../../../../dist/node/http/services/HttpErrorMapper';
import HttpError                 from '../../../../dist/node/http/exceptions/HttpError';
import BadRequestHttpError       from '../../../../dist/node/http/exceptions/BadRequestHttpError';
import UnauthorizedHttpError     from '../../../../dist/node/http/exceptions/UnauthorizedHttpError';
import ForbiddenHttpError        from '../../../../dist/node/http/exceptions/ForbiddenHttpError';
import NotFoundHttpError         from '../../../../dist/node/http/exceptions/NotFoundHttpError';
import MethodNotAllowedHttpError from '../../../../dist/node/http/exceptions/MethodNotAllowedHttpError';
import TimeoutHttpError          from '../../../../dist/node/http/exceptions/TimeoutHttpError';

let result;
let httpErrorMapper;
let status;


//-- Mocks
//--------------------------------------------------------



//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.status = (value) => {
	status = value;
};

given.httpErrorMapper = () => {
	httpErrorMapper = container.make(HttpErrorMapper);
};


//-- When
//--------------------------------------------------------

when.gettingErrorMapping = () => {
	when.attempting(() => {
		result = httpErrorMapper.getHttpErrorMapping();
	});
};

when.gettingErrorFromHttpStatus = () => {
	when.attempting(() => {
		result = httpErrorMapper.getErrorFromHttpStatus(status);
	});
};

when.gettingErrorInstanceFromHttpStatus = () => {
	when.attempting(() => {
		result = httpErrorMapper.getErrorInstanceFromHttpStatus(status);
	});
};

when.gettingDefaultMessageFromHttpStatus = () => {
	when.attempting(() => {
		result = httpErrorMapper.getDefaultMessageFromHttpStatus(status);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldBeInstanceOf = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(expected);
};

then.shouldHaveReceivedClass = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(result.name).toBe(expected.name);
};

then.resultShouldBeBadRequestHttpError = () => {
	then.shouldHaveReceivedClass(BadRequestHttpError);
};

then.resultShouldBeUnauthorizedHttpError = () => {
	then.shouldHaveReceivedClass(UnauthorizedHttpError);
};

then.resultShouldBeForbiddenHttpError = () => {
	then.shouldHaveReceivedClass(ForbiddenHttpError);
};

then.resultShouldBeNotFoundHttpError = () => {
	then.shouldHaveReceivedClass(NotFoundHttpError);
};

then.resultShouldBeMethodNotAllowedHttpError = () => {
	then.shouldHaveReceivedClass(MethodNotAllowedHttpError);
};

then.resultShouldBeTimeoutHttpError = () => {
	then.shouldHaveReceivedClass(TimeoutHttpError);
};

then.resultShouldBeInstanceOfBadRequestHttpError = () => {
	then.resultShouldBeInstanceOf(BadRequestHttpError);
};

then.resultShouldBeInstanceOfUnauthorizedHttpError = () => {
	then.resultShouldBeInstanceOf(UnauthorizedHttpError);
};

then.resultShouldBeInstanceOfForbiddenHttpError = () => {
	then.resultShouldBeInstanceOf(ForbiddenHttpError);
};

then.resultShouldBeInstanceOfNotFoundHttpError = () => {
	then.resultShouldBeInstanceOf(NotFoundHttpError);
};

then.resultShouldBeInstanceOfMethodNotAllowedHttpError = () => {
	then.resultShouldBeInstanceOf(MethodNotAllowedHttpError);
};

then.resultShouldBeInstanceOfTimeoutHttpError = () => {
	then.resultShouldBeInstanceOf(TimeoutHttpError);
};

then.shouldHaveReceivedErrorMapping = () => {
	then.shouldNotHaveThrown();
	Object.entries({
		400: 'Bad Request.',
		401: 'Unauthorized.',
		403: 'Forbidden.',
		404: 'Not Found.',
		408: 'Timeout.'
	}).forEach(([key, message]) => {
		expect(result).toHaveProperty(key);
		expect(result[key]).toMatchObject({ message });
		expect(result[key].error).toBeTruthy();
		expect(result[key].error.prototype).toBeInstanceOf(HttpError);
	});
};


export default build({ given, when, then });
