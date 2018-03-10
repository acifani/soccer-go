import * as inquirer from 'inquirer';
import * as commands from './commands';
import { questions } from './constants/questions';

(async () => {
  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);
    const competition = answers.competition;
    switch (answers.main) {
      case 'Matchday':
        commands.fixtures.matchday(competition);
        break;
      case 'Standings':
        console.log('Standings coming soon!');
        break;
      case 'Team':
        commands.team.get(answers.teamCode, answers.teamOptions);
        break;
    }
  } catch (error) {
    console.log(error);
  }
})();
