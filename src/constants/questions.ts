import { Answers, Questions } from "inquirer";

export const questions: Questions = [
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
    when: (answers: Answers) => answers.home === 'Team',
  },
  {
    name: 'teamName',
    type: 'input',
    message: 'Team code',
    when: (answers: Answers) => answers.home === 'Team',
  },
  {
    name: 'matchdayLeague',
    type: 'input',
    message: 'League code',
    when: (answers: Answers) => answers.home === 'Matchday',
  },
];
