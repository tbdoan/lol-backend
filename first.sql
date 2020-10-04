-- CREATE TABLE winrates (id INTEGER PRIMARY KEY, hero1id INTEGER, hero1 TEXT,  hero2id INTEGER, hero2 TEXT, matchup NUMERIC);

-- Add a new column 'NewColumnName' to table 'TableName' in schema 'SchemaName'
BULK
INSERT winrates
FROM '~/Projects/lol-backend/final.csv'
WITH
(
FIELDTERMINATOR = ',',
ROWTERMINATOR = '\n'
)
GO
