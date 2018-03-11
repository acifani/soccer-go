#!/usr/bin/env node
import * as inquirer from 'inquirer';
import * as commands from './commands';
import { questions } from './constants/questions';

(async () => {
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
