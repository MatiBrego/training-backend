import  sqlite3  from "sqlite3";

const db = new sqlite3.Database('../src/models/secret_santa.db', (err) => {if(err) console.log(err.message);});

export function QuerySecretSantaByGroup(group_id, callback){
    
    const sql = "SELECT P1.name AS gifter_name, P2.name AS giftee_name, year FROM secret_santas " +
    "JOIN people AS P1 ON gifter_id = P1.id "+
    "JOIN people AS P2 ON giftee_id = P2.id " +
    "JOIN group_people As GP1 ON gifter_id = GP1.person_id "+
    "JOIN group_people As GP2 ON giftee_id = GP2.person_id "+
    "WHERE GP1.group_id = ? AND GP2.group_id = ? "+
        "GROUP BY yer " +
        "ORDER BY year";

    db.all(sql, [group_id, group_id], (err, rows) => {
        if(err) console.log(err);


        let result = getJsonByYear(rows);



        callback(err, result)
    });



    function getJsonByYear(rows){
        let currentYear = rows[0].year;
        let result = {};
        let santasByYear = {};

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if(row.year !== currentYear){
                result[currentYear] = santasByYear;
                santasByYear = {};
                currentYear = row.year;
            }
            santasByYear[row.gifter_name] = row.giftee_name;
        }
        result[currentYear] = santasByYear;

        return result;
    }


}