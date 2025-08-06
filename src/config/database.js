const mongoose = require('mongoose')


const connectToDB=  async()=>{
    try {   
       await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log("Error connecting to MongoDB",error)
    }
}



module.exports = connectToDB
