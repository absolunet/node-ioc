//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - Drivers - Stack Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container   from '../../../../container';
import StackDriver from '../../../../../../dist/node/log/services/Logger/drivers/StackDriver';

let driver;
let config;
let caughtErrors;


//-- Mocks
//--------------------------------------------------------

const fakeLogger = {
	logWithChannel: jest.fn(async (...parameters) => {
		try {
			await fakeLogger.unsafeLogWithChannel(...parameters);
		} catch (error) {
			caughtErrors++;
		}
	}),
	unsafeLogWithChannel: jest.fn(async (channel) => {
		if (channel === 'broken') {
			throw new TypeError('An error occurred...');
		}

		await Promise.resolve();
	})
};


//-- Given
//--------------------------------------------------------

given.fakeLogger = () => {
	container.singleton('log', fakeLogger);
	caughtErrors = 0;
};

given.stackDriver = () => {
	driver      = container.make(StackDriver);
	({ config } = driver);
};

given.config = (key, value) => {
	config[key] = value;
	driver.setConfig(config);
};

given.channels = (value) => {
	given.config('channels', value);
};

given.ignoreException = () => {
	given.config('ignore_exceptions', true);
};

given.noIgnoreException = () => {
	given.config('ignore_exceptions', false);
};


//-- When
//--------------------------------------------------------

when.logging = async () => {
	await when.attemptingAsync(async () => {
		await driver.log(4, 'A message to log', { key: 'value' });
	});
};


//-- Then
//--------------------------------------------------------

then.driverShouldHaveLoggedTimes = (name, times) => {
	then.shouldNotHaveThrown();
	const channelNames = {
		fake: ['single', 'other'],
		broken: ['broken']
	}[name];
	const { length: count } = fakeLogger.unsafeLogWithChannel.mock.calls.filter(([channel]) => {
		return channelNames.includes(channel);
	});
	expect(count).toBe(times);
};

then.fakeDriverShouldHaveLogged = () => {
	then.driverShouldHaveLoggedTimes('fake', 1);
};

then.fakeDriverShouldHaveLoggedTwice = () => {
	then.driverShouldHaveLoggedTimes('fake', 2);
};

then.brokenDriverShouldNotHaveLogged = () => {
	then.driverShouldHaveLoggedTimes('broken', 0);
};

then.brokenDriverShouldHaveLogged = () => {
	then.driverShouldHaveLoggedTimes('broken', 1);
};

then.fakeDriverShouldHaveLoggedPlusErrorAndBrokenLog = () => {
	then.driverShouldHaveLoggedTimes('fake', 1);
	then.shouldHaveOneCaughtError();
};

then.shouldHaveCaughtCountError = (count) => {
	then.shouldNotHaveThrown();
	expect(caughtErrors).toBe(count);
};

then.shouldNotHaveCaughtError = () => {
	then.shouldHaveCaughtCountError(0);
};

then.shouldHaveOneCaughtError = () => {
	then.shouldHaveCaughtCountError(1);
};


export default build({ given, when, then });
