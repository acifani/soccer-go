import { Answers } from 'inquirer';
import * as api from '../api';
import { Fixture, Player, Team } from '../models';

export const get = (answers: Answers): void => {
  (async () => {
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
  })();
};

const fetchTeamByName = async (answers: Answers): Promise<Team> => {
  const teamName = answers.teamName;
  const compName = answers.competition;
  const teamId = await api.getTeamId(teamName, compName);
  const teamData = await api.getTeam(teamId);
  return new Team(teamData);
};
