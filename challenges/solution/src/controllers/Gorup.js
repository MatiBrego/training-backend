import { QueryAllGroups, QueryInsertGroup } from "../services/GroupsTable.js";

export function addGroup(req, res){
    const group_name = req.body.name;
    
    QueryInsertGroup(group_name);
    res.send("Group created");
}

export function getAllGroups(req, res){
    
    QueryAllGroups((err, groups) => {
        if(err) console.log(err.message);
        res.json(groups);
    })
}