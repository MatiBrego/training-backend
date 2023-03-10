const sqlite3 = require('sqlite3');

//Conect to the db
const db = new sqlite3.Database('secret_santa.db', (err) => {if(err) console.log(err.message)});
var sql;

//Create groups table
sql = 'CREATE TABLE groups(id INTEGER PRIMARY KEY, name VARCHAR(255))';
db.run(sql, (err) => {if(err) console.log(err.message)});

//Create people table
sql = 'CREATE TABLE people(id INTEGER PRIMARY KEY, name VARCHAR(255))';
db.run(sql, (err) => {if(err) console.log(err.message)});

//Create Group Person table
sql = 'CREATE TABLE group_people(id INTEGER PRIMARY KEY, person_id INTEGER REFERENCES people (id), group_id INTEGER REFERENCES groups (id))';
db.run(sql, (err) => {if(err) console.log(err.message)});

//Create Secret Santa table
sql = 'CREATE TABLE secret_santas(id INTEGER PRIMARY KEY, gifter_id INTEGER REFERENCES group_people (id), giftee_id INTEGER REFERENCES group_people (id), year INTEGER)';
db.run(sql, (err) => {if(err) console.log(err.message)});


