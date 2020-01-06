//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Terminal
//--------------------------------------------------------

import gwt from './Terminal.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.providersAndDependencies();
	given.bootedContainer();
	given.terminal();
	given.fakeProcessArgv();
	given.mockedInquirerPrompt();
	given.mockedCrossSpawn();
	given.fakePromptResult(undefined);
});

afterEach(() => {
	then.resetProcessArgv();
	then.resetInquirerPromptMock();
});


test('Can get argv based on process', () => {
	when.gettingArgv();
	then.resultShouldBeProcessArgvArguments();
});

test('Can get command as string', () => {
	when.gettingCommand();
	then.resultShouldBeCurrentCommand();
});

test('Can get command arguments, assuming that current command does not contains space', () => {
	when.gettingArgs();
	then.resultShouldBeCurrentCommandArguments();
});

test('Can get inquirer instance', () => {
	when.gettingInquirer();
	then.resultShouldBeInquirerModule();
});

test('Can spawn', () => {
	when.callingSpawn('node', ['foo', 'bar'], { stdio: 'inherit' });
	then.shouldHaveCalledCrossSpawn('node', ['foo', 'bar'], { stdio: 'inherit' });
});

test('Can spawn sync', () => {
	when.callingSpawnSync('node', ['foo', 'bar'], { stdio: 'inherit' });
	then.shouldHaveCalledCrossSpawnSync('node', ['foo', 'bar'], { stdio: 'inherit' });
});

test('Can ask question', async () => {
	await when.askingQuestion();
	then.shouldHaveCalledPromptOnInquirer();
});

test('Can ask question with default answer', () => {
	when.askingQuestionWithDefaultAnswer();
	then.shouldHaveCalledPromptOnInquirerWithDefaultAnswer();
});

test('Can ask a question with secret answer', () => {
	when.askingSecret();
	then.shouldHaveCalledPromptOnInquirerWithTypePassword();
});

test('Can ask for confirmation', async () => {
	given.fakePromptResult({ answer: true });
	await when.confirming();
	then.shouldHaveCalledPromptOnInquirerWithDefaultAnswerAsFalse();
	then.resultShouldBe(true);
});

test('Can ask a question with choices of answer as array', () => {
	when.askingWithChoicesAsArray();
	then.shouldHaveCalledPromptOnInquirerWithChoices();
});

test('Can ask a question with choices of answer as key-value pairs', () => {
	when.askingWithChoicesAsObject();
	then.shouldHaveCalledPromptOnInquirerWithChoices();
});

test('Can ask a question with choices of answer with a default answer', () => {
	when.askingWithChoicesWithDefaultAnswer();
	then.shouldHaveCalledPromptOnInquirerWithChoicesWithDefaultAnswer();
});

test('Can print a table with header and data as arrays', () => {
	given.fakePrintOnTerminal();
	when.printingTable();
	then.tableShouldHaveBeenPrinted();
	then.resetPrintMock();
	then.resetPrintMock();
});

test('Can get the table as string without printing it', () => {
	given.fakePrintOnTerminal();
	when.gettingTable();
	then.shouldNotHavePrinted();
	then.shouldHaveReceivedTableAsString();
	then.resetPrintMock();
	then.resetPrintMock();
});

test('Can print multiple tables one under the other', () => {
	given.fakePrintOnTerminal();
	when.printingTables();
	then.tablesShouldHaveBeenPrintedOneUnderTheOther();
	then.resetPrintMock();
	then.resetPrintMock();
});

test('Can print multiple tables side by side', () => {
	given.fakePrintOnTerminal();
	when.printingTablesSideBySide();
	then.tablesShouldHaveBeenPrintedSideBySide();
	then.resetPrintMock();
	then.resetPrintMock();
});

test('Can get multiple tables one under the other as string', () => {
	given.fakePrintOnTerminal();
	when.gettingTables();
	then.shouldNotHavePrinted();
	then.shouldHaveReceivedTableOneUnderTheOtherAsString();
	then.resetPrintMock();
	then.resetPrintMock();
});

test('Can get multiple tables side by side as string', () => {
	given.fakePrintOnTerminal();
	when.gettingTablesSideBySide();
	then.shouldNotHavePrinted();
	then.shouldHaveReceivedTableSideBySideAsString();
	then.resetPrintMock();
	then.resetPrintMock();
});
