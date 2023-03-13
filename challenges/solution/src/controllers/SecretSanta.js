import { QuerySecretSantaByGroup } from "../services/SecretSantaTable.js";
import {createSecretSanta} from "../services/CreateSecretSantaV3.js";


export function generateSecretSanta(req, res){
    createSecretSanta(req.params.group_id, (err, result) => {
        if(err) console.log(err);
        res.json(result)
    })
}

export function getSecretSantaHistory(req, res){
const group_id = req.params.group_id;

    QuerySecretSantaByGroup(group_id, (err, secretSantas) => {
        if(err) console.log(err);
        res.json(secretSantas);
    })
}