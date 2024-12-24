const express = require('express');
const cors = require('cors');

const app = express();

const middleware = require('./utils/middleware')

app.use(cors());

const seatingOfParliamentRouter = require('./controllers/seatingofparliament')
const memberOfParliamentRouter = require('./controllers/memberofparliament')
const valihuutoRouter = require('./controllers/valihuuto')

app.use('/tinyimages', express.static('./pictures/tinyMemberImages'));
app.use('/api/seatingOfParliament', seatingOfParliamentRouter)
app.use('/api/MemberOfParliament', memberOfParliamentRouter)
app.use('/api/valihuudot', valihuutoRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app
