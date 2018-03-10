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

export const questions = [
  {
    message: 'Choose a competition',
    name: 'competition',
    source: searchLeague,
    type: 'autocomplete',
  },
  {
    choices: ['Matchday', 'Standings', 'Team'],
    message: 'Choose a function',
    name: 'main',
    type: 'list',
    when: (answers: inquirer.Answers) => answers.competition,
  },
  {
    message: 'Team code',
    name: 'teamCode',
    type: 'input',
    when: (answers: inquirer.Answers) => answers.main === 'Team',
  },
  {
    choices: ['Fixtures', 'Players'],
    message: 'Team info',
    name: 'teamOptions',
    type: 'checkbox',
    when: (answers: inquirer.Answers) => answers.main === 'Team',
  },
];
