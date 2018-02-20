import * as program from 'commander';
const version = require('../package.json').version; // tslint:disable-line

import * as commands from './commands';

program.version(version);

program
  .command('matchday <competition>')
  .description('Get the current matchday game of a given competition')
  .action((comp: string) => commands.fixtures.matchday(comp));

program
  .command('team <team_name>')
  .description('Get info about a given team')
  .option('-f, --fixtures', 'Get team fixtures')
  .option('-p, --players', 'Get team players')
  .action((teamName: string, options: any) =>
    commands.team.get(teamName, options)
  );

program.parse(process.argv);
