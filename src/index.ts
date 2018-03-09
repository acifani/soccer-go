import * as inquirer from 'inquirer';
import * as commands from './commands';

const questions: inquirer.Questions = [
  {
    name: 'home',
    type: 'list',
    message: 'What do you want to do?',
    choices: ['Team', 'Matchday', 'Standings'],
  },
  {
    name: 'teamOptions',
    type: 'checkbox',
    message: 'What do you want to see?',
    choices: ['Fixtures', 'Players'],
    when: (answers: inquirer.Answers) => answers.home === 'Team',
  },
  {
    name: 'teamName',
    type: 'input',
    message: 'Team code',
    when: (answers: inquirer.Answers) => answers.home === 'Team',
  },
  {
    name: 'matchdayLeague',
    type: 'input',
    message: 'League code',
    when: (answers: inquirer.Answers) => answers.home === 'Matchday',
  },
];

(async () => {
  try {
    const answers: inquirer.Answers = await inquirer.prompt(questions);
    console.log(JSON.stringify(answers, null, '  '));
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
