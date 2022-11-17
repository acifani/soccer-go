#!/usr/bin/env node

import pc from 'picocolors'
import program from 'commander'
import { checkForUpdates } from './utils/update-check'
import pkg from '../package.json'
import * as commands from './commands'
import { getLeagueByName } from './constants/leagues'
import { questions } from './constants/questions'

const askQuestions = async (): Promise<void> => {
  try {
    const answers = await questions()
    const league = getLeagueByName(answers.league)
    switch (answers.main) {
      case 'Matchday':
        commands.printMatchday(league.code)
        break
      case 'Standings':
        commands.printStandings(league.code)
        break
      case 'Team':
        commands.printTeam(answers.teamName, answers.teamOptions, league.code)
        break
    }
  } catch (error) {
    console.log(error)
  }
}

;(async (): Promise<void> => {
  program.version(pkg.version)

  program
    .command('standings <league>')
    .alias('s')
    .on('--help', () =>
      console.log(`
        Get the full league table.

        Example:

        ${pc.green('sgo s SA')}    Print Serie A table`),
    )
    .action((league: string) => commands.printStandings(league))

  program
    .command('matchday <league>')
    .alias('m')
    .on('--help', () =>
      console.log(`
        Get matchday for a given League.

        Example:

        ${pc.green('sgo m SA')}    Print Serie A matchday`),
    )
    .action((league: string) => commands.printMatchday(league))

  program
    .command('team <league> <team>')
    .alias('t')
    .option('-f, --fixtures', 'include fixtures')
    .option('-p, --players', 'include players')
    .on('--help', () =>
      console.log(`
        Get team games and/or players.

        Example:

        ${pc.green('sgo t SA roma -f')}             Print AS Roma fixtures
        ${pc.green('sgo t PD "real madrid" -p')}    Print Real Madrid players`),
    )
    .action((league: string, team: string, opts: { fixtures: boolean; players: boolean }) =>
      commands.printTeam(
        team,
        [opts.fixtures ? 'Fixtures' : '', opts.players ? 'Players' : ''],
        league,
      ),
    )

  program.command('*').action((cmd) => {
    console.log(`Unknown command "${cmd}".`)
    process.exit(1)
  })

  if (process.argv.length === 2) {
    await askQuestions()
  }

  program.parse(process.argv)
})()

process.on('beforeExit', async () => {
  await checkForUpdates(pkg)
})
