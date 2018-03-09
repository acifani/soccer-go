import * as inquirer from 'inquirer';
import { ILeague, leagueCodes } from './leagues';
// tslint:disable-next-line
const autocomplete = require('inquirer-autocomplete-prompt');
inquirer.registerPrompt('autocomplete', autocomplete);

const searchLeague = (answers: any, input: string) => {
  input = input || '';
  return new Promise(resolve => {
    resolve(
      leagueCodes.filter((league: ILeague) =>
        league.name.match(new RegExp(input, 'i'))
      )
    );
  });
};

export const questions: any = [
  {
    choices: ['Team', 'Matchday', 'Standings'],
    message: 'What do you want to do?',
    name: 'home',
    type: 'list',
  },
  {
    choices: ['Fixtures', 'Players'],
    message: 'What do you want to see?',
    name: 'teamOptions',
    type: 'checkbox',
    when: (answers: inquirer.Answers) => answers.home === 'Team',
  },
  {
    message: 'Team code',
    name: 'teamName',
    type: 'input',
    when: (answers: inquirer.Answers) => answers.home === 'Team',
  },
  {
    message: 'League code',
    name: 'matchdayLeague',
    source: searchLeague,
    type: 'autocomplete',
    when: (answers: inquirer.Answers) => answers.home === 'Matchday',
  },
];
