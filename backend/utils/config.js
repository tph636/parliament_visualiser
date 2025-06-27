const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const PORT = process.env.PORT

module.exports = {
    PORT
}
