"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const JSONData = JSON.parse(fs.readFileSync('final.json', { encoding: 'utf8', flag: 'r' }));
let i = 0;
fs.writeFileSync('./final.csv', 'champ1,champ2,winrate,numGames,lane\n');
for (const [hero1, hero1data] of Object.entries(JSONData)) {
    for (const [lane, laneObject] of Object.entries(hero1data)) {
        if (laneObject !== null) {
            for (const row of laneObject) {
                fs.appendFileSync('./final.csv', `${++i},${hero1},${row.vs.toLowerCase().replace(/\W/g, '')},${row.winrate},${row.numGames},${lane}\n`);
            }
        }
    }
}
