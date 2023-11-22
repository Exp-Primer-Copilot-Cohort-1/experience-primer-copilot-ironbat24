//Create web server
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

//Set up the server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Set up the database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('comments.json');
const db = low(adapter);

//Set up the database
db.defaults({ comments: [] }).write();

//Add a new comment
app.post('/api/comments', (req, res) => {
    console.log('Adding new comment');
    console.log(req.body);
    const comment = req.body;
    db.get('comments').push(comment).write();
    res.json(comment);
});

//Get all comments
app.get('/api/comments', (req, res) => {
    console.log('Getting all comments');
    const comments = db.get('comments').value();
    res.json(comments);
});

//Get a specific comment
app.get('/api/comments/:id', (req, res) => {
    console.log('Getting a specific comment');
    const id = Number(req.params.id);
    const comment = db.get('comments').find({ id: id }).value();
    res.json(comment);
});

//Delete a comment
app.delete('/api/comments/:id', (req, res) => {
    console.log('Deleting a comment');
    const id = Number(req.params.id);
    db.get('comments').remove({ id: id }).write();
    res.json(id);
});

//Update a comment
app.put('/api/comments/:id', (req, res) => {
    console.log('Updating a comment');
    const comment = req.body;
    const id = Number(req.params.id);
    db.get('comments').find({ id: id }).assign(comment).write();
    res.json(comment);
});

//Set up the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));