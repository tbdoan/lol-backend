import { Connection, Request, TYPES } from 'tedious';
import fs = require('fs');
import chalk = require('chalk');
const error = chalk.bold.red;
const success = chalk.keyword('green');

const config = {
  server: 'dodgepog.database.windows.net',
  authentication: {
    type: 'default',
    options: {
      userName: 'tbdoan',
      password: 'Wowzer2000',
    },
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: 'Winrates',
    validateBulkLoadParameters: true,
  },
};

function loadJSON(): object {
  return JSON.parse(
    fs.readFileSync('final.json', { encoding: 'utf8', flag: 'r' })
  );
}

function insertRow(
  id: number,
  hero1: string,
  hero2: string,
  matchup: number,
  numGames: number,
  lane: string
) {
  let request = new Request(
    'INSERT INTO Winrates VALUES(@id, @hero1, @hero2, @matchup, @numGames, @lane);',
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  request.addParameter('id', TYPES.Int, id);
  request.addParameter('hero1', TYPES.Text, hero1);
  request.addParameter('hero2', TYPES.Text, hero2);
  request.addParameter('matchup', TYPES.Decimal, matchup);
  request.addParameter('numGames', TYPES.Int, numGames);
  request.addParameter('lane', TYPES.Text, lane);

  connection.execSql(request);
}
const connection = new Connection(config);
//@ts-ignore
connection.connect();
connection.on('connect', function (err) {
  // If no error, then good to proceed.
  console.log('Connected');
  const data = loadJSON();
  let i = 1;
  for (const [hero1, hero1data] of Object.entries(data)) {
    for (const [lane, laneObject] of Object.entries(hero1data)) {
      if (laneObject !== null) {
        for (const row of laneObject) {
          fs.appendFile('./final.csv');
          insertRow(i, hero1, row.vs, row.winrate, row.numGames, lane);
          i++;
        }
      }
    }
  }
  console.log(i);
});

function executeStatement() {
  const request = new Request('SELECT * FROM dbo.winrates', function (err) {
    if (err) {
      console.log(err);
    }
  });
  var result = '';
  request.on('row', function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log('NULL');
      } else {
        result += column.value + ' ';
      }
    });
    console.log(result);
    result = '';
  });

  request.on('done', function (rowCount, more) {
    console.log(rowCount + ' rows returned');
  });
  connection.execSql(request);
}
