import {QueryAllPeople, QueryInsertPerson, QueryPersonById, QueryUpdatePersonTag} from "../services/PeopleTable.js";


export function addPerson(req, res){
    const name = req.body.name;

    QueryInsertPerson(name);
    res.send("Person created");
}

export function getAllPeople(req, res){

    QueryAllPeople((err, people) => {
        if(err) console.log(err);
        res.json(people);
    });
}

export function getPersonById(req, res){
    const person_id = req.params.person_id;

    QueryPersonById(person_id, (err, people) =>{
        if(err) console.log(err.message);
        res.json(people); 
    });
}

export function addTag(req, res){
    const person_id = req.body.person_id;
    const newTag = req.body.tag;

    QueryUpdatePersonTag(person_id, newTag);
    res.send("Tag updated");
}


