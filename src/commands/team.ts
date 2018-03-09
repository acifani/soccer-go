import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import { Answers } from 'inquirer';
import cfg from '../config';
import { Fixture, Player, Team } from '../models';

export const get = (teamName: string, options: Answers): void => {
  (async () => {
    try {
      const teamResponse: AxiosResponse = await axios.get(
        `${cfg.apiBaseUrl}/teams/${teamName}`,
        cfg.axiosConfig
      );
      const team = new Team(teamResponse.data);
      team.print();

      if (options.includes('Fixtures')) {
        const table = new Table({
          head: ['Home - Away', 'Score', 'Status', 'Date'],
          style: { head: [], border: [] },
        }) as Table.HorizontalTable;

        const fixtureResponse: AxiosResponse = await axios.get(
          team.links.fixtures,
          cfg.axiosConfig
        );
        fixtureResponse.data.fixtures.forEach((fix: any) => {
          const fixture = new Fixture(fix);
          table.push(fixture.toRow());
        });

        console.log(table.toString());
      }

      if (options.includes('Players')) {
        const table = new Table({
          head: ['Name', 'Jersey', 'Position', 'Nationality', 'Date of Birth'],
          style: {
            border: [],
            head: [],
          },
        }) as Table.HorizontalTable;

        const playersResponse: AxiosResponse = await axios.get(
          team.links.players,
          cfg.axiosConfig
        );
        playersResponse.data.players.forEach((p: any) => {
          const player = new Player(p);
          table.push(player.toRow());
        });

        console.log(table.toString());
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  })();
};
