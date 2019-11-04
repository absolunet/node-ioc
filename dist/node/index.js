"use strict";

//--------------------------------------------------------
//-- Node IoC
//--------------------------------------------------------

/* eslint-disable global-require */
module.exports = {
  get Application() {
    return require('./foundation/Application').default;
  },

  get BaseProxy() {
    return require('./support/proxies/BaseProxy').default;
  },

  get Controller() {
    return require('./http/controllers/Controller').default;
  },

  get Command() {
    return require('./console/Command').default;
  },

  get ConsoleKernel() {
    return require('./foundation/console/Kernel').default;
  },

  get ExceptionHandler() {
    return require('./foundation/exceptions/Handler').default;
  },

  get ForwardProxy() {
    return require('./support/proxies/ForwardProxy').default;
  },

  get GeneratorCommand() {
    return require('./console/GeneratorCommand').default;
  },

  get Kernel() {
    return require('./foundation/Kernel').default;
  },

  get Migration() {
    return require('./database/Migration').default;
  },

  get Model() {
    return require('./database/Model').default;
  },

  get ModelFactory() {
    return require('./database/Factory').default;
  },

  get NotImplementedError() {
    return require('./foundation/exceptions/NotImplementedError').default;
  },

  get NullDriverProxy() {
    return require('./support/drivers/NullDriverProxy').default;
  },

  get Seeder() {
    return require('./database/Seeder').default;
  },

  get ServiceProvider() {
    return require('./foundation/ServiceProvider').default;
  },

  get TestCase() {
    return require('./test/TestCase').default;
  },

  get Tester() {
    return require('./test/services/Tester').default;
  },

  get mixins() {
    return require('./support/mixins').default;
  }

};
/* eslint-enable global-require */