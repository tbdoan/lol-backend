import fs = require('fs');

const JSONData: object = JSON.parse(
  fs.readFileSync('final.json', { encoding: 'utf8', flag: 'r' })
);

let i = 1;
for (const [hero1, hero1data] of Object.entries(JSONData)) {
  for (const [lane, laneObject] of Object.entries(hero1data)) {
    if (laneObject !== null) {
      for (const row of laneObject) {
        fs.appendFileSync(
          './final.csv',
          `${i},${hero1},${row.vs},${row.winrate},${row.numGames},${lane}\n`
        );
        i++;
      }
    }
  }
}
