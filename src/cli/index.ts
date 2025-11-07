#!/usr/bin/env node

import { Command } from 'commander';
import { CliApplication } from './application/index.js';

(async () => {
  const app = new CliApplication();
  await app.initialize();

  const program = new Command();
  program
    .name('ksef-pdf')
    .description('Generator PDF dla faktur i UPO z systemu KSeF')
    .version('0.0.1');

  app.setupCommands(program);
  program.parse(process.argv);
})();
