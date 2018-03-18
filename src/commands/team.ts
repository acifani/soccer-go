import { Answers } from 'inquirer';
import * as api from '../api';
import { Fixture, Player, Team } from '../models';

export const printTeam = async (answers: Answers) => {
  const options = answers.teamOptions;
  const team = await fetchTeamByName(answers);
  team.print();

  if (options.includes('Fixtures')) {
    const fixturesData = await api.getTeamFixtures(team);
    const table = Fixture.buildTable(fixturesData);
    console.log(table.toString());
  }

  if (options.includes('Players')) {
    const playersData = await api.getTeamPlayers(team);
    const table = Player.buildTable(playersData);
    console.log(table.toString());
  }
};

const fetchTeamByName = async (answers: Answers): Promise<Team> => {
  try {
    const teamId = await api.getTeamId(answers.teamName, answers.competition);
    const teamData = await api.getTeam(teamId);
    return new Team(teamData);
  } catch (error) {
    console.log(error.message)
    process.exit(1)
    throw new Error(error)
  }
};
