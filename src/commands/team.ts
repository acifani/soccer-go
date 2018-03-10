import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import { Answers } from 'inquirer';
import * as ora from 'ora';
import * as api from '../api';
import cfg from '../config';
import { Fixture, IFixtureJson, IPlayerJson, Player, Team } from '../models';

export const get = (answers: Answers): void => {
  (async () => {
    const teamName = answers.teamName;
    const compName = answers.competition;
    const options = answers.teamOptions;

    const teamId = await api.getTeamId(teamName, compName);
    const teamData = await api.getTeam(teamId);
    const team = new Team(teamData);
    team.print();

    if (options.includes('Fixtures')) {
      const fixturesData = await api.getTeamFixtures(team);
      const teamFixtures = fixturesData.map((f: IFixtureJson) =>
        new Fixture(f).toRow()
      );

      const table = Fixture.buildTable();
      table.push(...teamFixtures);
      console.log(table.toString());
    }

    if (options.includes('Players')) {
      const playersData = await api.getTeamPlayers(team);
      const players = playersData.map((p: IPlayerJson) =>
        new Player(p).toRow()
      );

      const table = Player.buildTable();
      table.push(...players);
      console.log(table.toString());
    }
  })();
};
