#!/usr/bin/env node

import * as inquirer from 'inquirer';
// tslint:disable-next-line
const pkg: UpdateNotifier.Package = require('../package.json');
import * as program from 'commander';
import * as UpdateNotifier from 'update-notifier';
import * as commands from './commands';
import { questions } from './constants/questions';

const askQuestions = async () => {
  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);
    switch (answers.main) {
      case 'Matchday':
        commands.printMatchday(answers.league);
        break;
      case 'Standings':
        commands.printStandings(answers.league);
        break;
      case 'Team':
        commands.printTeam(
          answers.teamName,
          answers.teamOptions,
          answers.league
        );
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  UpdateNotifier({ pkg }).notify();

  program.version(pkg.version);

  program
    .command('standings')
    .alias('s')
    .option('-l, --league <code>', 'league code')
    .action(opts => commands.printStandings(opts.league));

  program
    .command('matchday')
    .alias('m')
    .option('-l, --league <code>', 'league code')
    .action(opts => commands.printMatchday(opts.league));

  program
    .command('team <name>')
    .alias('t')
    .option('-l, --league <code>', 'league code')
    .option('-f, --fixtures', 'display fixtures')
    .option('-p, --players', 'display players')
    .action((name, opts) =>
      commands.printTeam(
        name,
        [opts.fixtures ? 'Fixtures' : '', opts.players ? 'Players' : ''],
        opts.league
      )
    );

  program.command('*').action(cmd => {
    console.log(`Unknown command "${cmd}".`);
    process.exit(1);
  });

  if (process.argv.length === 2) {
    await askQuestions();
  }

  program.parse(process.argv);
})();
