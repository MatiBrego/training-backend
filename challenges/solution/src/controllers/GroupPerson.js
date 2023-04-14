import { QueryAllGroupPeople, QueryInsertGroupPerson } from "../services/GroupPeopleTable.js";

export function addPersonToGroup(req, res){

    QueryInsertGroupPerson(req.params.person_id, req.params.group_id);

    res.send("Person added to group");
}

export function getAllGroupPeople(req, res){
    QueryAllGroupPeople((err, groupPeople) =>{

        if(err) console.log(err.message);
        
        res.json(groupPeople);
    })
}