const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect(process.env.mongo_url)

const connection= mongoose.connection;

connection.on('connected' , ()=>{
    console.log("MongoDB Atlas Connection Successfull!!");
})

connection.on('error' , (err)=>{
    console.log("MongoDB Connection Failed!!");
})