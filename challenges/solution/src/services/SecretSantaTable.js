import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});

export function QuerySecretSantaByGroup(group_id, callback){
    
    const sql = "SELECT P1.name AS gifter_name, P2.name AS giftee_name, year FROM secret_santas " +
    "JOIN people AS P1 ON gifter_id = P1.id "+
    "JOIN people AS P2 ON giftee_id = P2.id " +
    "JOIN group_people As GP1 ON gifter_id = GP1.person_id "+
    "JOIN group_people As GP2 ON giftee_id = GP2.person_id "+
    "WHERE GP1.group_id = ? AND GP2.group_id = ? "+
        "ORDER BY year";

    db.all(sql, [group_id, group_id], (err, rows) => {
        if(err) console.log(err);

        let result = rows.reduce(function (r, a) {
            r[a.year] = r[a.year] || {};
            r[a.year][a.gifter_name] = a.giftee_name;
            return r;
        })

        callback(err, result)
    });
}