const mongoose = require('mongoose');
const gridfsStream = require('fridfs-stream');

// For storing files in MongoDB (may be not the best idea)

let gfs;

const initGridFS = () => {
    const conn = mongoose.connection;
    conn.once('open', () => {
        gfs = gridfsStream(conn.db, mongoose.mongo);
        gfs.collection('uploads');
    });
};

const getGfs = () => gfs;

module.exports = { initGridFS, getGfs };