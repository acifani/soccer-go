#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import pc from 'picocolors'
import pkg from '../package.json'
import * as commands from './commands'
import { getLeagueByName } from './constants/leagues'
import { questions } from './constants/questions'
import { handleCommandError } from './utils/errors'
import { checkForUpdates } from './utils/update-check'

const askQuestions = async (): Promise<void> => {
  try {
    const answers = await questions()
    const league = getLeagueByName(answers.league)
    switch (answers.main) {
      case 'Matchday':
        await commands.printMatchday(league.code)
        break
      case 'Standings':
        await commands.printStandings(league.code)
        break
      case 'Scorers':
        await commands.printScorers(league.code)
        break
      case 'Team':
        await commands.printTeam(answers.teamName, answers.teamOptions, league.code)
        break
    }
  } catch (error) {
    // Handle cancellation gracefully
    if (error instanceof Error && error.name === 'ExitPromptError') {
      process.exit(0)
    }
    handleCommandError(error)
  }
}

;(async (): Promise<void> => {
  if (process.argv.length === 2) {
    await askQuestions()
    return
  }

  const program = new Command()
  program
    .name('sgo')
    .description('⚽ Get soccer stats and results from your terminal')
    .version(pkg.version)
    .addHelpText(
      'after',
      `
Examples:
  ${pc.green('sgo')}                       Run in interactive mode
  ${pc.green('sgo standings PL')}          Show Premier League table
  ${pc.green('sgo scorers PL')}            Show Premier League top scorers
  ${pc.green('sgo matchday SA')}           Show Serie A matchday fixtures
  ${pc.green('sgo team PL arsenal -f')}    Show Arsenal fixtures

League Codes:
  PL (Premier League), SA (Serie A), BL1 (Bundesliga),
  PD (La Liga), FL1 (Ligue 1), CL (Champions League), etc.

Run ${pc.cyan('sgo')} with no arguments for interactive mode.
`,
    )

  program
    .command('standings')
    .alias('s')
    .argument('<league>', 'League code (e.g., PL, SA, BL1)')
    .description('Get the full league table')
    .addHelpText(
      'after',
      `
Example:

  ${pc.green('sgo s SA')}    Print Serie A table
`,
    )
    .action((league) => commands.printStandings(league).catch(handleCommandError))

  program
    .command('matchday')
    .alias('m')
    .argument('<league>', 'League code (e.g., PL, SA, BL1)')
    .description('Get matchday fixtures for a given league')
    .addHelpText(
      'after',
      `
Example:
  ${pc.green('sgo m SA')}    Print Serie A matchday
`,
    )
    .action((league) => commands.printMatchday(league).catch(handleCommandError))

  program
    .command('scorers')
    .alias('sc')
    .argument('<league>', 'League code (e.g., PL, SA, BL1)')
    .description('Get top scorers for a given league')
    .addHelpText(
      'after',
      `
Example:
  ${pc.green('sgo sc PL')}    Print Premier League top scorers
`,
    )
    .action((league) => commands.printScorers(league).catch(handleCommandError))

  program
    .command('team')
    .alias('t')
    .argument('<league>', 'League code (e.g., PL, SA, BL1)')
    .argument('<team>', 'Team name (use quotes for multi-word names)')
    .description('Get team information, fixtures, and players')
    .option('-f, --fixtures', 'include fixtures')
    .option('-p, --players', 'include players')
    .addHelpText(
      'after',
      `
Example:
  ${pc.green('sgo t SA roma -f')}             Print AS Roma fixtures
  ${pc.green('sgo t PD "real madrid" -p')}    Print Real Madrid players
`,
    )
    .action((league, team, opts) =>
      commands
        .printTeam(team, [opts.fixtures ? 'Fixtures' : '', opts.players ? 'Players' : ''], league)
        .catch(handleCommandError),
    )

  program.parse(process.argv)
})()

process.on('uncaughtException', handleCommandError)

process.on('beforeExit', async () => {
  await checkForUpdates(pkg)
})
