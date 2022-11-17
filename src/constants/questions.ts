import { prompt } from 'enquirer'
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
  let answers: any = await prompt([
    {
      type: 'autocomplete',
      name: 'league',
      message: 'Choose a league',
      choices: leagueCodes.map((l) => l.name),
      // @ts-expect-error: remove once types are fixed
      limit: 10,
    },
    {
      type: 'select',
      name: 'main',
      message: 'Choose a function',
      choices: ['Matchday', 'Standings', 'Team'],
    },
  ])

  if (answers.main === 'Team') {
    const teamAnswers = await prompt([
      {
        type: 'input',
        name: 'teamName',
        message: 'Team name',
      },
      {
        type: 'multiselect',
        name: 'teamOptions',
        message: 'Team info',
        choices: ['Fixtures', 'Players'],
      },
    ])

    answers = {
      ...answers,
      ...teamAnswers,
    }
  }

  return answers as Answers
}
