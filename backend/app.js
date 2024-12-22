require('dotenv').config()
const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

const seatingOfParliamentRouter = require('./controllers/seatingofparliament')

const memberOfParliamentRouter = require('./controllers/memberofparliament')


app.use('/tinyimages', express.static(path.join(__dirname, 'pictures', 'tinyMemberImages')));

app.use('/api/seatingOfParliament', seatingOfParliamentRouter)

app.use('/api/MemberOfParliament', memberOfParliamentRouter)


module.exports = app
