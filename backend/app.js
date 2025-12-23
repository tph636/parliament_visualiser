const express = require('express');
const cors = require('cors');

const app = express();

const middleware = require('./utils/middleware');

app.use(cors());

app.use(
  '/images/low-res',
  express.static('/app/assets/images/low-res', { maxAge: '30d' })
);

app.use(
  '/images/high-res',
  express.static('/app/assets/images/high-res', { maxAge: '30d' })
);

app.use(middleware.requestLogger);

// Routers
const memberOfParliamentRouter = require('./controllers/memberofparliament');
const valihuutoRouter = require('./controllers/valihuuto');
const partyRouter = require('./controllers/party');

app.use('/api/member_of_parliament', memberOfParliamentRouter);
app.use('/api/valihuudot', valihuutoRouter);
app.use('/api/party', partyRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
