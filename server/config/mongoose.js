const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://vanshajbajaj:vanshaj25@cluster0.vwuxlcq.mongodb.net/lifepulsedb?retryWrites=true&w=majority');

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error while connecting to db"));

db.once('open',function(){
    console.log("successfully connected to database");
})