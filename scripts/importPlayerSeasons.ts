import 'dotenv/config';

import * as fs from 'fs/promises';
import * as path from 'path';
import * as downloadGitRepo from 'download-git-repo';
import * as Knex from 'knex';
import * as parseCsv from 'neat-csv';
import { PlayerSeasonModel } from '../src/database/models/player-season.model';

const db = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: true,
});

async function main() {
  try {
    await downloadRepo();
    await parse2016Data();
    await parse2017Data();
    await parse2018Data();
    await parse2019Data();
    await parse2020Data();

    await fs.rmdir(path.join(__dirname, 'tmp'), { recursive: true });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function parse2020Data() {
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2020-21/players_raw.csv'),
    'utf-8',
  );
  const players = await parseCsv(csv);

  await Promise.all(players.map((player) => import2020Player(player)));
}

async function import2020Player(player: any) {
  const id = `${player.first_name}_${player.second_name}_${player.id}`;
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2020-21/players', id, 'gw.csv'),
    'utf-8',
  );
  const gameweeks = await parseCsv(csv);

  await PlayerSeasonModel.query(db).insert({
    gameweeks: JSON.stringify(gameweeks),
    playerCode: player.code,
    season: 2020,
  });
}

async function parse2019Data() {
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2019-20/players_raw.csv'),
    'utf-8',
  );
  const players = await parseCsv(csv);

  await Promise.all(players.map((player) => import2019Player(player)));
}

async function import2019Player(player: any) {
  const id = `${player.first_name}_${player.second_name}_${player.id}`;
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2019-20/players', id, 'gw.csv'),
    'utf-8',
  );
  const gameweeks = await parseCsv(csv);

  await PlayerSeasonModel.query(db).insert({
    gameweeks: JSON.stringify(gameweeks),
    playerCode: player.code,
    season: 2019,
  });
}

async function parse2018Data() {
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2018-19/players_raw.csv'),
    'utf-8',
  );
  const players = await parseCsv(csv);

  await Promise.all(players.map((player) => import2018Player(player)));
}

async function import2018Player(player: any) {
  const id = `${player.first_name}_${player.second_name}_${player.id}`;
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2018-19/players', id, 'gw.csv'),
    'utf-8',
  );
  const gameweeks = await parseCsv(csv);

  await PlayerSeasonModel.query(db).insert({
    gameweeks: JSON.stringify(gameweeks),
    playerCode: player.code,
    season: 2018,
  });
}

async function parse2017Data() {
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2017-18/players_raw.csv'),
    'utf-8',
  );
  const players = await parseCsv(csv);

  await Promise.all(players.map((player) => import2017Player(player)));
}

async function import2017Player(player: any) {
  const id = `${player.first_name}_${player.second_name}`;
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2017-18/players', id, 'gw.csv'),
    'utf-8',
  );
  const gameweeks = await parseCsv(csv);

  await PlayerSeasonModel.query(db).insert({
    gameweeks: JSON.stringify(gameweeks),
    playerCode: player.code,
    season: 2017,
  });
}

async function parse2016Data() {
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2016-17/players_raw.csv'),
    'utf-8',
  );
  const players = await parseCsv(csv);

  await Promise.all(players.map((player) => import2016Player(player)));
}

async function import2016Player(player: any) {
  const id = `${player.first_name}_${player.second_name}`;
  const csv = await fs.readFile(
    path.join(__dirname, 'tmp/data/2016-17/players', id, 'gw.csv'),
    'utf-8',
  );
  const gameweeks = await parseCsv(csv);

  await PlayerSeasonModel.query(db).insert({
    gameweeks: JSON.stringify(gameweeks),
    playerCode: player.code,
    season: 2016,
  });
}

function downloadRepo() {
  return new Promise((resolve, reject) => {
    downloadGitRepo(
      'vaastav/Fantasy-Premier-League',
      path.join(__dirname, 'tmp'),
      (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      },
    );
  });
}

main();
