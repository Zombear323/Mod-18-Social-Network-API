// import connection to mongoose
const { connect, connection } = require('mongoose');

// URL for mongodb connection to the socialNetworkDb
connect('mongodb://127.0.0.1:27017/socialNetworkDb');

module.exports = connection;

