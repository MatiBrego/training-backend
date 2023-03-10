import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});

export function QueryInsertPerson(name){

    var sql = 'INSERT INTO people(name) VALUES (?)';

    db.run(sql, [name], (err) => {if(err) console.log(err.message);})
}

export function QueryAllPeople(callback){
    var sql = 'SELECT * FROM people'

    db.all(sql, [], callback)
}

export function QueryPersonById(id, callback){
    var sql = 'SELECT * FROM people WHERE id = ?';

    db.all(sql, [person_id], callback)
}