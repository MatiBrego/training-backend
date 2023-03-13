import  sqlite3  from "sqlite3";
const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});


export async function createSecretSanta(group_id, callback){
    const sql = "SELECT name, people.id, tag, group_id FROM people JOIN group_people ON person_id = people.id where group_id = ?";

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
    let gifters = [];
    let giftees = [];

    let tags = new Map();

    fillTags(rows, tags);

    const secretSantasMap = {}

    while(gifters.length < rows.length){

        const pair = await selectPair(gifters, giftees, tags, rows)

        // const sql = "INSERT INTO secret_santas(gifter_id, giftee_id, year) VALUES (?, ?, ?)";
        // db.run(sql, [gifter.id, giftee.id, new Date().getFullYear()], (err) => {if(err) return console.log(err)})

        gifters.push(pair.gifter);
        giftees.push(pair.giftee);

        secretSantasMap[pair.gifter.name] = pair.giftee.name;
    }

    console.log(secretSantasMap)
    return secretSantasMap;
}

function fillTags(rows, tags){
    for (let i = 0; i < rows.length; i++) {
        let rowTag = rows[i].tag;
        if(tags.has(rowTag)) tags.get(rowTag).push(rows[i])
        else tags.set(rowTag, [rows[i]])
    }
}

async function selectPair(gifters, giftees, tags, rows){
    let randomIntMax = rows.length;

    let gifter = rows[getRandomInt(randomIntMax)];
    while(gifters.includes(gifter)){
        gifter = rows[getRandomInt(randomIntMax)];
    }

    let tag_keys = tags.keys()

    for (let i = 0; i < tag_keys.length; i++){
        let tag_key = tag_keys.next();
        if (tag_key === gifter.tag) continue;

        let tag_row = tags[tag_key].length

        for (let j = 0; j < tag_row; j++) {
            let giftee = tag_row[0];

            if (giftee.id === gifter.id ||
                giftees.includes(giftee) ||
                gifters.includes(gifter) ||
                await checkPreviousSecretSantas(gifter, giftee)){

                return {gifter: gifter, giftee: giftee};
            }
        }
    }

    let giftee = tags.get(gifter.tag)[getRandomInt(randomIntMax)];

    while  (giftee.id === gifter.id ||
            giftees.includes(giftee) ||
            gifters.includes(gifter) ||
            await checkPreviousSecretSantas(gifter, giftee)){
        giftee = tags.get(gifter.tag)[getRandomInt(randomIntMax)];
    }


    return {gifter: gifter, giftee: giftee}
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
