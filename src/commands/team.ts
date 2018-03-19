// tslint:disable-next-line
const figlet = require('figlet');
import { Answers } from 'inquirer';
import * as api from '../api';
import { Fixture, Player, Team } from '../models';
import { FixturesTableBuilder, PlayersTableBuilder } from '../tableBuilders';

export const printTeam = async (answers: Answers) => {
  const options = answers.teamOptions;
  const team = await fetchTeamByName(answers);
  const teamTitle = figlet.textSync(team.shortName || team.name, {
    font: 'slant',
  });
  console.log(teamTitle);

  if (options.includes('Fixtures')) {
    const fixturesData = await api.getTeamFixtures(team);
    const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture);
    console.log(table.toString());
  }

  if (options.includes('Players')) {
    const playersData = await api.getTeamPlayers(team);
    const table = new PlayersTableBuilder().buildTable(playersData, Player);
    console.log(table.toString());
  }
};

const fetchTeamByName = async (answers: Answers): Promise<Team> => {
  try {
    const teamId = await api.getTeamId(answers.teamName, answers.competition);
    const teamData = await api.getTeam(teamId);
    return new Team(teamData);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
    throw new Error(error);
  }
};
