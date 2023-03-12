import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});

export function QueryInsertGroup(name){
    const sql = 'INSERT INTO groups(name) VALUES (?)';

    db.run(sql, [name], (err) => {if(err) console.log(err.message);})
}

export function QueryAllGroups(callback){
    const sql = 'SELECT * FROM groups'

    db.all(sql, [], callback);

}