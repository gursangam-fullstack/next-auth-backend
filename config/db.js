const mongoose = require("mongoose");

exports.connectDb = async (DATABASE_URL) => {
    
    try {
        // const DB_OPTIONS = {
        //     dbName: "passportjsauth"
        // }
        await mongoose.connect(DATABASE_URL)
        console.log('connected successfully');
    } catch (error) {
        console.log("failed to connect mongodb", error);
    }
}

