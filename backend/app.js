const express = require('express');
const cors = require('cors');

const app = express();

const middleware = require('./utils/middleware')

app.use(cors());

app.use('/tinyimages', express.static('./pictures/tinyMemberImages'));
app.use('/memberImage', express.static('./pictures/memberImages'));

app.use(middleware.requestLogger)

const memberOfParliamentRouter = require('./controllers/memberofparliament')
const valihuutoRouter = require('./controllers/valihuuto')
app.use('/api/member_of_parliament', memberOfParliamentRouter)
app.use('/api/valihuudot', valihuutoRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app
