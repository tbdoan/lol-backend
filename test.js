"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tedious_1 = require("tedious");
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
const connection = new tedious_1.Connection(config);
//@ts-ignore
connection.connect();
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log('Connected');
    insertRow();
});
function executeStatement() {
    const request = new tedious_1.Request('SELECT * FROM dbo.winrates', function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = '';
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            }
            else {
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
function insertRow() {
    let request = new tedious_1.Request('INSERT INTO Winrates VALUES(@id, @hero1id,@hero1, @hero2id, @hero2, @matchup);', function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('id', tedious_1.TYPES.Int, 0);
    request.addParameter('hero1id', tedious_1.TYPES.Int, 69);
    request.addParameter('hero1', tedious_1.TYPES.Text, 'boonga');
    request.addParameter('hero2id', tedious_1.TYPES.Int, 11);
    request.addParameter('hero2', tedious_1.TYPES.Text, 'ya mums bruh');
    request.addParameter('matchup', tedious_1.TYPES.Decimal, 0.5);
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            }
            else {
                console.log('Product id of inserted item is ' + column.value);
            }
        });
    });
    connection.execSql(request);
}
