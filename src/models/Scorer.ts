import Table from 'cli-table3'
import { IRowable } from '../tableBuilders/BaseTableBuilder'

export default class Scorer implements IRowable {
  public playerName: string
  public teamName: string
  public goals: number
  public assists: number | null
  public penalties: number | null
  public playedMatches: number

  constructor(data: IScorerJson) {
    this.playerName = data.player.name
    this.teamName = data.team.shortName || data.team.name
    this.goals = data.goals
    this.assists = data.assists
    this.penalties = data.penalties
    this.playedMatches = data.playedMatches
  }

  public toRow = (idx: number): Table.Cell[] => [
    idx + 1,
    this.playerName,
    this.teamName,
    this.goals,
    this.assists ?? 0,
    this.penalties ?? 0,
    this.playedMatches,
  ]
}

export interface IScorersResponseJson {
  count: number
  filters: {
    season: string
    limit: number
  }
  competition: ICompetition
  season: ISeason
  scorers: IScorerJson[]
}

export interface IScorerJson {
  player: IPlayer
  team: ITeam
  playedMatches: number
  goals: number
  assists: number | null
  penalties: number | null
}

interface IPlayer {
  id: number
  name: string
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  section: string
  position: string | null
  shirtNumber: number | null
  lastUpdated: string
}

interface ITeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  address: string
  website: string
  founded: number
  clubColors: string
  venue: string
  lastUpdated: string
}

interface ICompetition {
  id: number
  name: string
  code: string
  type: string
  emblem: string
}

interface ISeason {
  id: number
  startDate: string
  endDate: string
  currentMatchday: number
  winner: null
}
