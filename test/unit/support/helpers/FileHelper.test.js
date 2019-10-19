//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - String Helper
//--------------------------------------------------------

import gwt from './FileHelper.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fileHelper();
	given.emptyResult();
	given.size(undefined);
	given.options({});
});


test('Can format size to human-readable string', () => {
	given.size(1048576);
	when.formattingSize();
	then.resultShouldBe('1MB');
});

test('Can parse human-readable string to size', () => {
	given.size('0.5MB');
	when.parsingSize();
	then.resultShouldBe(524288);
});
