const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const uri = process.env.MONGO_URI ;


async function connect() {
await mongoose.connect(uri, {

});
console.log('MongoDB connected');
}


module.exports = { connect };