import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import { Answers } from 'inquirer';
import * as ora from 'ora';
import * as api from '../api';
import cfg from '../config';
import { Fixture, Player, Team } from '../models';

export const get = (teamCode: string, options: Answers): void => {
  (async () => {
    const teamData = await api.getTeam(teamCode);
    const team = new Team(teamData);
    team.print();

    if (options.includes('Fixtures')) {
      const table = Fixture.buildTable();
      const teamFixtures = await api.getTeamFixtures(team);

      teamFixtures.forEach((fix: any) => {
        const fixture = new Fixture(fix);
        table.push(fixture.toRow());
      });

      console.log(table.toString());
    }

    if (options.includes('Players')) {
      const table = Player.buildTable();
      const teamPlayers = await api.getTeamPlayers(team);

      teamPlayers.forEach((p: any) => {
        const player = new Player(p);
        table.push(player.toRow());
      });

      console.log(table.toString());
    }
  })();
};
