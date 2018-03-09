import * as inquirer from 'inquirer';
import * as commands from './commands';
import { questions } from './constants/questions';

(async () => {
  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);

    switch (answers.home) {
      case 'Team':
        commands.team.get(answers.teamName, answers.teamOptions);
        break;
      case 'Matchday':
        commands.fixtures.matchday(answers.matchdayLeague);
        break;
    }
  } catch (error) {
    console.log(error);
  }
})();
