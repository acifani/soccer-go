#!/usr/bin/env node

import * as inquirer from 'inquirer';
// tslint:disable-next-line
const pkg = require('../package.json');
import * as UpdateNotifier from 'update-notifier';
import * as commands from './commands';
import { questions } from './constants/questions';

(async () => {
  UpdateNotifier({ pkg }).notify({ isGlobal: true });

  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);
    switch (answers.main) {
      case 'Matchday':
        commands.printMatchday(answers.competition);
        break;
      case 'Standings':
        commands.printStandings(answers.competition);
        break;
      case 'Team':
        commands.printTeam(answers);
        break;
    }
  } catch (error) {
    console.log(error);
  }
})();
