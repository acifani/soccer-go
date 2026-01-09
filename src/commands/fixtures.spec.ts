import { printMatchday } from './fixtures'

// Mock dependencies
jest.mock('../api')
jest.mock('cfonts')
jest.mock('../constants/leagues')
jest.mock('../tableBuilders')

import * as api from '../api'
import cfonts from 'cfonts'
import { getLeagueByCode } from '../constants/leagues'
import { FixturesTableBuilder } from '../tableBuilders'

const mockGetMatchday = api.getMatchday as jest.MockedFunction<typeof api.getMatchday>
const mockCfonts = cfonts as jest.Mocked<typeof cfonts>
const mockGetLeagueByCode = getLeagueByCode as jest.MockedFunction<typeof getLeagueByCode>

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('printMatchday', () => {
  let mockTableBuilder: any
  let mockTable: any
  let consoleLogSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    mockTable = {
      toString: jest.fn().mockReturnValue('table output'),
    }

    mockTableBuilder = {
      buildTable: jest.fn().mockReturnValue(mockTable),
    }
    ;(FixturesTableBuilder as jest.MockedClass<typeof FixturesTableBuilder>).mockImplementation(
      () => mockTableBuilder,
    )

    mockGetLeagueByCode.mockReturnValue({
      name: 'Premier League',
      code: 'PL',
      type: 'LEAGUE',
    })

    mockCfonts.say = jest.fn()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('should fetch fixtures and display table', async () => {
    const mockFixtures = [
      { id: 1, status: 'FINISHED' },
      { id: 2, status: 'SCHEDULED' },
    ]
    mockGetMatchday.mockResolvedValue(mockFixtures as any)

    await printMatchday('PL')

    expect(mockGetLeagueByCode).toHaveBeenCalledWith('PL')
    expect(mockGetMatchday).toHaveBeenCalledWith('PL')
    expect(mockCfonts.say).toHaveBeenCalledWith('Premier League')
    expect(mockTableBuilder.buildTable).toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith('table output')
  })

  it('should call API with league code from getLeagueByCode', async () => {
    mockGetMatchday.mockResolvedValue([] as any)

    await printMatchday('PD')

    expect(mockGetLeagueByCode).toHaveBeenCalledWith('PD')
  })

  it('should display league name with cfonts', async () => {
    mockGetLeagueByCode.mockReturnValue({
      name: 'La Liga',
      code: 'PD',
      type: 'LEAGUE',
    })
    mockGetMatchday.mockResolvedValue([] as any)

    await printMatchday('PD')

    expect(mockCfonts.say).toHaveBeenCalledWith('La Liga')
  })

  it('should build table and print it', async () => {
    const mockFixtures = [{ id: 1 }]
    mockGetMatchday.mockResolvedValue(mockFixtures as any)
    mockTable.toString.mockReturnValue('custom table output')

    await printMatchday('BL1')

    expect(mockTableBuilder.buildTable).toHaveBeenCalled()
    expect(mockTable.toString).toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith('custom table output')
  })
})
