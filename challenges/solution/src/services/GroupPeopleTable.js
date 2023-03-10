import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});

export function QueryInsertGroupPerson(person_id, group_id){

    var sql = 'INSERT INTO group_people(person_id, group_id) VALUES (?, ?)';

    db.run(sql, [Number.parseInt(person_id), Number.parseInt(group_id)], (err) => {if(err) console.log(err.message);})
}

export function QueryAllGroupPeople(callback){
    var sql = 'SELECT * FROM group_people'

    db.all(sql, [], callback)
}

