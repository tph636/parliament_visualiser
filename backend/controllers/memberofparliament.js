const memberOfParliamentRouter = require('express').Router();
const { getDatabase, fetchAll } = require('../utils/dbUtils');
const { DOMParser } = require('xmldom'); // Import DOMParser for node environment

memberOfParliamentRouter.get('', async (request, response) => {
  const db = getDatabase();
  try {
    const members = await fetchAll(db, 'SELECT personId, lastname, firstname, party, minister, XmlDataFi FROM MemberOfParliament');

    // Parse XML data and append birthYear and parliamentGroup for each member
    const updatedMembers = members.map(member => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(member.XmlDataFi, 'text/xml');
      const birthDate = xmlDoc.getElementsByTagName('SyntymaPvm')[0]?.childNodes[0]?.nodeValue;
      const parliamentGroup = xmlDoc.getElementsByTagName('NykyinenEduskuntaryhma')[0]?.getElementsByTagName('Nimi')[0]?.childNodes[0]?.nodeValue;

      // Return member without XmlDataFi
      return {
        personId: member.personId,
        lastname: member.lastname,
        firstname: member.firstname,
        minister: member.minister,
        birthYear: birthDate ? new Date(birthDate).getFullYear() : null,
        parliamentGroup: parliamentGroup || null
      };
    });

    response.json(updatedMembers); // Return the updated member data
  } catch (err) {
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

module.exports = memberOfParliamentRouter;
