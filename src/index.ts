#!/usr/bin/env node

import * as inquirer from 'inquirer';
// tslint:disable-next-line
const pkg = require('../package.json');
import * as program from 'commander';
import * as UpdateNotifier from 'update-notifier';
import * as commands from './commands';
import { getLeagueByName } from './constants/leagues';
import { questions } from './constants/questions';

const askQuestions = async () => {
  UpdateNotifier({ pkg }).notify({ isGlobal: true });

  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);
    const league = getLeagueByName(answers.league);
    switch (answers.main) {
      case 'Matchday':
        commands.printMatchday(league.code);
        break;
      case 'Standings':
        commands.printStandings(league.code);
        break;
      case 'Team':
        commands.printTeam(answers.teamName, answers.teamOptions, league.code);
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  UpdateNotifier({ pkg }).notify({ isGlobal: true });

  program.version(pkg.version);

  program
    .command('standings <league>')
    .alias('s')
    .action(league => commands.printStandings(league));

  program
    .command('matchday <league>')
    .alias('m')
    .action(league => commands.printMatchday(league));

  program
    .command('team <league> <team>')
    .alias('t')
    .option('-f, --fixtures', 'include fixtures')
    .option('-p, --players', 'include players')
    .action((league, team, opts) =>
      commands.printTeam(
        team,
        [opts.fixtures ? 'Fixtures' : '', opts.players ? 'Players' : ''],
        league
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
