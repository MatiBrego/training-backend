import  sqlite3  from "sqlite3";
const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});


export function createSecretSanta(group_id, callback){
    const sql = "SELECT name, people.id, group_id FROM people JOIN group_people ON person_id = people.id where group_id = ?";

    db.all(sql, [group_id], async (err, peopleInGroup) => {
        if (err) console.log(err)

        if(peopleInGroup.length < 4) {
            callback(err, {error: "Group is not big enough"})
        }else {
            let result = await distributeSecretSantas(peopleInGroup);
            callback(err, result);
        }
    })
}

async function distributeSecretSantas(rows){
    let randomIntMax = rows.length;

    let gifters = [];
    let giftees = [];

    const secretSantasMap = {}

    while(gifters.length < rows.length){

        let gifter = rows[getRandomInt(randomIntMax)];
        let giftee = rows[getRandomInt(randomIntMax)];

        while  (giftee.id === gifter.id ||
                giftees.includes(giftee) ||
                gifters.includes(gifter) ||
                await checkPreviousSecretSantas(gifter, giftee)){
            gifter = rows[getRandomInt(randomIntMax)];
            giftee = rows[getRandomInt(randomIntMax)];
        }

        const sql = "INSERT INTO secret_santas(gifter_id, giftee_id, year) VALUES (?, ?, ?)";
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

async function checkPreviousSecretSantas(gifter, giftee){
    let prevYear = new Date().getFullYear() - 1;
    const sql = "SELECT gifter_id, giftee_id FROM secret_santas where gifter_id = ? AND giftee_id = ? AND year = ?";


    for (let i = 0; i < 2; i++) {

        let queryResult = await query(sql, [gifter.id, giftee.id, prevYear]);

        if(queryResult.rows.length !== 0) {
            return true;
        }

        prevYear -= 1;
    }
    return false;
}

function query(sql, params){
    return new Promise(function (resolve, reject) {
        db.all(sql, params, function (err, rows){
            if(err) reject(err);
            else resolve({rows: rows});
        })
    })
}