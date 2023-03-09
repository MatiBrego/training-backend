const express = require('express');
const parser = require('body-parser');
const sqlite3 = require('sqlite3')
const app = express();

app.use(parser.json())
app.use(parser.urlencoded({extended: false}))

const db = new sqlite3.Database('secret_santa.db', (err) => {if(err) console.log(err.message);});

app.post('/api/group', (req, res, next) =>{

    var sql = 'INSERT INTO groups(name) VALUES (?)';

    db.run(sql, [req.body.name], (err) => {if(err) console.log(err.message);})
    
    res.send('Group was created successfully');
})

//Returns all groups
app.get('/api/group', (req, res, next) =>{
    var sql = 'SELECT * FROM groups'

    db.all(sql, [], (err, rows) =>{
        res.json(rows)
    })
})

app.post('/api/person', (req, res, next) =>{

    var sql = 'INSERT INTO people(name) VALUES (?)';

    db.run(sql, [req.body.name], (err) => {if(err) console.log(err.message);})

    sql = 'SELECT name FROM people WHERE name = ?'

    db.all(sql, [req.body.name], (err, rows) =>{
        console.log(rows[0]);
    })  
})

//Returns all people
app.get('/api/person', (req, res, next) =>{
    var sql = 'SELECT * FROM people'

    db.all(sql, [], (err, rows) =>{
        res.json(rows)
    })
})


app.listen(3000, () => console.log('Running at port 3000'))
