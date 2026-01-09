import { search, select, input, checkbox } from '@inquirer/prompts'
import cfonts from 'cfonts'
import { leagueCodes } from './leagues'
import { TeamOptions } from '../commands/team'

type Answers =
  | {
      league: string
      main: 'team'
      teamName: string
      teamOptions: TeamOptions
    }
  | {
      league: string
      main: 'matchday' | 'standings' | 'scorers'
    }

export async function questions(): Promise<Answers> {
  cfonts.say('SOCCER-GO', {
    font: 'tiny',
    colors: ['green'],
    space: false,
  })

  // League selection with search
  const league = await search({
    message: 'Choose a league',
    source: async (input) => {
      const filtered = !input
        ? leagueCodes
        : leagueCodes.filter((l) => l.name.toLowerCase().includes(input.toLowerCase()))
      return filtered.slice(0, 10).map((l) => ({
        name: l.name,
        value: l.name,
      }))
    },
  })

  // Main function selection
  const main = await select({
    message: 'Choose a function',
    choices: [
      { name: 'Matchday', value: 'matchday' },
      { name: 'Standings', value: 'standings' },
      { name: 'Top Scorers', value: 'scorers' },
      { name: 'Team info', value: 'team' },
    ],
  })

  // Conditional team prompts
  if (main === 'team') {
    const teamName = await input({
      message: 'Team name',
    })

    const teamOptions = await checkbox({
      message: 'Team info',
      choices: [
        { name: 'Fixtures', value: 'fixtures' },
        { name: 'Players', value: 'players' },
        { name: 'Details', value: 'details' },
      ],
    })

    return {
      league,
      main,
      teamName,
      teamOptions: {
        players: teamOptions.includes('players'),
        fixtures: teamOptions.includes('fixtures'),
        details: teamOptions.includes('details'),
      },
    }
  }

  return {
    league,
    main: main as 'matchday' | 'standings' | 'scorers',
  }
}
