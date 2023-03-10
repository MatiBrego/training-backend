const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('../db/secret_santa.db', (err) => {if(err) console.log(err.message);});

function createSecretSanta(rows){
    var randomIntMax = rows.length;

    var gifters = [];
    var giftees = [];

    const secretSantasMap = {}

    while(gifters.length < rows.length){

        var gifter = rows[getRandomInt(randomIntMax)];
        var giftee = rows[getRandomInt(randomIntMax)];

        while(giftee.id == gifter.id || giftees.includes(giftee) || gifters.includes(gifter) || secretSantasMap[giftee.name] == gifter.name){
            var gifter = rows[getRandomInt(randomIntMax)];
            var giftee = rows[getRandomInt(randomIntMax)];
        }

        var sql = "INSERT INTO secret_santas(gifter_id, giftee_id, year) VALUES (?, ?, ?)"
        db.run(sql, [gifter.id, giftee.id, new Date().getFullYear()], (err) => {if(err) return console.log(err)})

        gifters.push(gifter);
        giftees.push(giftee);

        secretSantasMap[gifter.name] = giftee.name;
    }

    return JSON.stringify(secretSantasMap);
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}