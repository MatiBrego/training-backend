const express = require('express');
const parser = require('body-parser');
const sqlite3 = require('sqlite3')
const app = express();

app.use(parser.json())
app.use(parser.urlencoded({extended: false}))

const db = new sqlite3.Database('secret_santa.db', (err) => {if(err) console.log(err.message);});

app.post('/api/group', (req, res, next) =>{

    var sql = 'INSERT INTO groups(name) VALUES (?)';

    db.run(sql, [req.body.name], (err) => {
        if(err) console.log(err.message);
    })
})

//Returns all groups
app.get('/api/group', (req, res, next) =>{
    var sql = 'SELECT * FROM groups'

    db.all(sql, [], (err, rows) =>{
        if(err) console.log(err.message);

        res.json(rows);
    })
})

app.post('/api/person', (req, res, next) =>{

    var sql = 'INSERT INTO people(name) VALUES (?)';

    db.run(sql, [req.body.name], (err) => {if(err) console.log(err.message);})

    sql = 'SELECT name FROM people WHERE name = ?'

    db.all(sql, [req.body.name], (err, rows) =>{

        if(err) console.log(err.message);
        
        console.log(rows[0]);
    })  
})

//Returns all people
app.get('/api/person', (req, res, next) =>{
    var sql = 'SELECT * FROM people'

    db.all(sql, [], (err, rows) =>{
        if(err) console.log(err.message);
        
        res.json(rows);
    })
})

app.post('/api/group/add', (req, res, next) =>{

    var sql = 'INSERT INTO group_people(person_id, group_id) VALUES (?, ?)';

    db.run(sql, [Number.parseInt(req.body.person_id), Number.parseInt(req.body.group_id)], (err) => {
        if(err) console.log(err.message);
    })
})

//Returns all Group People
app.get('/api/group/add', (req, res, next) =>{

    var sql = 'SELECT * FROM group_people'

    db.all(sql, [], (err, rows) =>{
        if(err) console.log(err.message);
        
        res.json(rows);
    })
})

app.post('/api/secret_santa/', (req, res, next) =>{

    var sql = "SELECT name, person_id, group_id FROM people JOIN group_people ON person_id = people.id where group_id = ?"

    db.all(sql, [req.body.group_id], (err, rows) => {
        res.json(rows);
    })
})

app.listen(3000, () => console.log('Running at port 3000'))
