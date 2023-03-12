import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});


export function createSecretSanta(group_id, callback){
    const sql = "SELECT name, people.id, group_id FROM people JOIN group_people ON person_id = people.id where group_id = ?";

    db.all(sql, [group_id], (err, peopleInGroup) => {
        if (err) console.log(err)
        let result = distributeSecretSantas(peopleInGroup);

        callback(err, result);
    })
}

function distributeSecretSantas(rows){
    let randomIntMax = rows.length;

    let gifters = [];
    let giftees = [];

    const secretSantasMap = {}

    while(gifters.length < rows.length){

        let gifter = rows[getRandomInt(randomIntMax)];
        let giftee = rows[getRandomInt(randomIntMax)];

        while(giftee.id === gifter.id || giftees.includes(giftee) || gifters.includes(gifter) || secretSantasMap[giftee.name] === gifter.name){
            gifter = rows[getRandomInt(randomIntMax)];
            giftee = rows[getRandomInt(randomIntMax)];
        }

        const sql = "INSERT INTO secret_santas(gifter_id, giftee_id, year) VALUES (?, ?, ?)"
        db.run(sql, [gifter.id, giftee.id, new Date().getFullYear()], (err) => {if(err) return console.log(err)})

        gifters.push(gifter);
        giftees.push(giftee);

        secretSantasMap[gifter.name] = giftee.name;
    }

    return secretSantasMap;
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}