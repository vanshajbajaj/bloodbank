const express=require('express');
const cors=require('cors');
const port=8000;

const db=require('./config/mongoose');

const User=require('./models/User');
const Notice=require('./models/Notice');

const app=express();

// app.use(cors({
//     origin:"http://localhost:3000",
//     methods:["GET","POST","PUT","DELETE"],
// }));

// const corsOptions = {
//     origin: true, //included origin as true
//     credentials: true, //included credentials as true
// };

// app.use(cors(corsOptions));

// app.use(cors());

app.use(express.json());
// app.use(express.urlencoded());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(require('./router/auth'));

app.listen(port,function(err){

    if(err){
        console.log(err);
    }
    else{
        console.log("server is up and running on port: "+port);
    }

})
