import cfg from '../config'
import type { IPlayerJson } from './Player'

export interface ITeamLinks {
  self: string
  matches: string
  players: string
}

export default class Team {
  public id: number
  public name: string
  public code: string
  public shortName: string | null
  public venue: string | null
  public founded: number | null
  public clubColors: string | null
  public website: string | null
  public coach: ICoach | null
  public runningCompetitions: ICompetition[]
  public links: ITeamLinks
  public squad: IPlayerJson[]

  constructor(data: ITeamJson) {
    const baseLink = `${cfg.apiBaseUrl}/teams/${data.id}`

    this.id = data.id
    this.name = data.name
    this.code = data.tla
    this.shortName = data.shortName
    this.venue = data.venue || null
    this.founded = data.founded || null
    this.clubColors = data.clubColors || null
    this.website = data.website || null
    this.coach = data.coach || null
    this.runningCompetitions = data.runningCompetitions || []
    this.squad = data.squad
    this.links = {
      matches: `${baseLink}/matches`,
      players: `${baseLink}/players`,
      self: baseLink,
    }
  }
}

export interface ITeamJson {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  venue: string | null
  founded: number | null
  clubColors: string | null
  website: string | null
  coach: ICoach | null
  runningCompetitions: ICompetition[]
  squad: IPlayerJson[]
}

export interface ICompetition {
  id: number
  name: string
  code: string
  type: string
  emblem: string
}

export interface ICoach {
  id: number
  firstName: string
  lastName: string
  name: string
  dateOfBirth: string
  nationality: string
  contract: IContract
}

export interface IContract {
  start: string
  until: string
}
