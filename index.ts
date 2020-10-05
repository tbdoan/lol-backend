import express = require('express');
import mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'beed553cc9c2e9',
  password: '0a426dc8',
  database: 'heroku_9de24930314934e',
});

connection.connect();

const app = express();

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/api/:champ1/:champ2/:lane', (req, res) => {
  connection.query(
    `SELECT * FROM matchups WHERE champ1='${req.params.champ1}' AND champ2='${req.params.champ2}' AND lane='${req.params.lane}';`,
    (err: mysql.MysqlError, rows) => {
      if (err) res.send(err);
      else {
        if (rows.length == 0) res.status(404).send('Matchup not found.');
        else
          res.send({
            winrate: rows[0].winrate.toString(),
            numGames: rows[0].num_games.toString(),
          });
      }
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
