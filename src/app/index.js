//--------------------------------------------------------
//-- Node IoC - Bootstrapped application
//--------------------------------------------------------
'use strict';


// Load application main handlers
const ConsoleKernel = require('./../foundation/console/Kernel');
const ExceptionHandler = require('./../foundation/exceptions/Handler');


// Get a fresh instance of application
const app = require('./..');


// Register main handlers in the container
app.singleton('kernel.console', ConsoleKernel);
app.singleton('exception.handler', ExceptionHandler);


// Add a delay before bootstrapping to allow external registering
setTimeout(async () => {
	// Boot the application
	app.bootIfNotBooted();

	// Get the kernel instance
	const kernel = app.make(`kernel.console`);

	try { // Handle the incoming command or request
		await kernel.handle();
	} catch (error) { // Handle a thrown error by the kernel handling
		app.make('exception.handler').handle(error);
	}

	// Terminate the process
	kernel.terminate();
});


// Exporting the application to allows interactions
module.exports = app;
