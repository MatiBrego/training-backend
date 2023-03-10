import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});

export function createSecretSantaV1(group_id, callback){
    var sql = "SELECT name, people.id, group_id FROM people JOIN group_people ON person_id = people.id where group_id = ?";

    db.all(sql, [group_id], (err, peopleInGroup) => {

        if (err) console.log(err)

        var result = distributeSecretSantas(peopleInGroup);
        
        callback(result);
    })
}

export function QuerySecretSantaByGroup(group_id, callback){
    
    var sql = "SELECT P1.name AS gifter_name, P2.name AS giftee_name, year FROM secret_santas " +
    "JOIN people AS P1 ON gifter_id = P1.id "+
    "JOIN people AS P2 ON giftee_id = P2.id " +
    "JOIN group_people ON gifter_id = person_id "+
    "WHERE group_id = ? "+
    "ORDER BY year";

    db.all(sql, [group_id], callback);
}

function distributeSecretSantas(rows){
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

    return secretSantasMap;
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}