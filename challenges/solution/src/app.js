import express from 'express';
import bodyParser from 'body-parser';
import {getAllPeople, addPerson, getPersonById, addTag} from './controllers/Person.js';
import { getAllGroups, addGroup } from './controllers/Gorup.js';
import { addPersonToGroup, getAllGroupPeople } from './controllers/GroupPerson.js';
import { generateSecretSanta, getSecretSantaHistory } from './controllers/SecretSanta.js';

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/api/group', addGroup)

app.get('/api/group', getAllGroups)

app.post('/api/person', addPerson)

app.get('/api/person', getAllPeople)

app.get('/api/person/:person_id', getPersonById)

app.post('/api/group/add/:person_id/:group_id', addPersonToGroup)

app.get('/api/group/people', getAllGroupPeople)

app.post('/api/secret_santa/:group_id', generateSecretSanta)

app.get('/api/secret_santa/:group_id', getSecretSantaHistory)

app.post('/api/person/addTag', addTag)

app.listen(3000, () => console.log('Running at port 3000'))