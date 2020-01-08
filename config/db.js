const mongoose = require('mongoose');
//const dotenv = require('dotenv').config();
const config = require('config');
const db = config.get('mongoURI');




const connectDB = async () => {
    try{
        await mongoose.connect(db, {
           useNewUrlParser: true,
           useUnifiedTopology: true  
        });

        console.log('mongoDB is awake...')
    } catch(err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1); 
        }
}

module.exports = connectDB;