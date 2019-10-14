//--------------------------------------------------------
//-- Node IoC - Bootstrapped application
//--------------------------------------------------------
'use strict'; // Load the application

const Application = require('../foundation/Application'); // Load the application main handlers


const ConsoleKernel = require('../foundation/console/Kernel');

const ExceptionHandler = require('../foundation/exceptions/Handler'); // Get a fresh instance of the application


const app = Application.make(); // Register main handlers in the container

app.singleton('kernel.console', ConsoleKernel);
app.singleton('exception.handler', ExceptionHandler); // Add a delay before bootstrapping to allow external registering

setTimeout(async () => {
  // Get the kernel instance
  const kernel = app.make(`kernel.console`); // Boot the application

  app.bootIfNotBooted();

  try {
    // Handle the incoming command or request
    await kernel.handle();
  } catch (error) {
    // Handle a thrown error by the kernel handling
    await app.make('exception.handler').handle(error);
  } // Terminate the process


  kernel.terminate();
}); // Exporting the application to allows interactions

module.exports = app;