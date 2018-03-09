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
    type: 'autocomplete',
    message: 'League code',
    source: searchLeague,
    when: (answers: inquirer.Answers) => answers.home === 'Matchday',
  },
];
