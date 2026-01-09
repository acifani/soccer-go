import { search, select, input, checkbox } from '@inquirer/prompts'
import cfonts from 'cfonts'
import { leagueCodes } from './leagues'

type Answers =
  | {
      league: string
      main: 'Team'
      teamName: string
      teamOptions: Array<'Fixtures' | 'Players'>
    }
  | {
      league: string
      main: 'Matchday' | 'Standings'
    }

export async function questions(): Promise<Answers> {
  // Display banner
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
      { name: 'Matchday', value: 'Matchday' },
      { name: 'Standings', value: 'Standings' },
      { name: 'Team', value: 'Team' },
    ],
  })

  // Conditional team prompts
  if (main === 'Team') {
    const teamName = await input({
      message: 'Team name',
    })

    const teamOptions = await checkbox({
      message: 'Team info',
      choices: [
        { name: 'Fixtures', value: 'Fixtures' },
        { name: 'Players', value: 'Players' },
      ],
    })

    return {
      league,
      main,
      teamName,
      teamOptions: teamOptions as Array<'Fixtures' | 'Players'>,
    }
  }

  return {
    league,
    main: main as 'Matchday' | 'Standings',
  }
}
