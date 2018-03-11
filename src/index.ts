#!/usr/bin/env node

import * as inquirer from 'inquirer';
import * as commands from './commands';
import { questions } from './constants/questions';

(async () => {
  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);
    switch (answers.main) {
      case 'Matchday':
        commands.fixtures.matchday(answers.competition);
        break;
      case 'Standings':
        console.log('Standings coming soon!');
        break;
      case 'Team':
        commands.team.get(answers);
        break;
    }
  } catch (error) {
    console.log(error);
  }
})();
