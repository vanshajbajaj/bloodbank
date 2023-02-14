const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const authenticate = require('./../middleware/authenticate');
const authenticateadmin=require('./../middleware/authenticateadmin');

require("./../config/mongoose");

const User = require("./../models/User");
const Notice = require('./../models/Notice');

router.get('/', function (req, res) {

    res.send('Hello world');

});

// router.post('/register',function(req,res){

//     console.log(req.body);

//     const {name,email,phone,bloodgroup,password,cpassword} = req.body;

//     if(!name || !email || !phone || !bloodgroup || !password || !cpassword){

//         return res.status(401).json({erroe:"Please fill all the fields!"});

//     }

//     User.findOne({email:email})
//     .then((userExists)=>{

//         if(userExists){
//             return res.status(422).json({error:"Email already exists!"});
//         }

//         const user=new User({name,email,phone,bloodgroup,password,cpassword});

//         user.save().then(()=>{
//             res.status(201).json({message:"user registered successfully"});
//         } ).catch((err)=>res.status(500).json({error:"failed to register user"}));

//     }).catch((err)=>{
//         console.log(err);
//     })

// })

router.post('/register', async (req, res) => {

    console.log(req.body);

    const { name, email, phone, bloodgroup, password, cpassword } = req.body;

    if (!name || !email || !phone || !bloodgroup || !password || !cpassword) {

        return res.status(401).json({ erroe: "Please fill all the fields!" });

    }

    try {

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(422).json({ error: "Email already exists!" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords should be same" });
        }
        else {

            const user = new User({ name, email, phone, bloodgroup, password, cpassword });

            const userRegister = await user.save();

            if (userRegister) {
                return res.status(201).json({ message: "user registered successfully" });
            }
            else {
                return res.status(500).json({ error: "failed to register user" })
            }

        }

    }
    catch (err) {
        console.log(err);
    }


})

router.post('/signin', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "enter all fields" });
        }

        const userLogin = await User.findOne({ email: email });

        console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcryptjs.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                // credentials:'include',
                httpOnly: true,
            });


            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" })
            }
            else {
                return res.json({ message: "logged in successfully" })
            }

        }
        else {

            return res.status(400).json({ error: "Invalid Credentials" })

        }

    }
    catch (err) {
        console.log(err);
    }

})

router.get('/about1', authenticate, function (req, res) {

    console.log("about api called");
    return res.send(req.rootUser);

});

router.get('/admin1', authenticateadmin, function (req, res) {

    console.log("about api called");
    return res.send(req.rootUser);

});

router.get('/home1',async function(req,res){

    const rootUser=await Notice.find({});
    // console.log(rootUser);
    //req.rootUser=rootUser;
    return res.send(rootUser);

})

router.post('/donateapi', authenticate, async (req, res) => {

    try {

        const { name2, age2, phone2, bloodgroup2, type, stat } = req.body;

        console.log(req.body);
        console.log(req.userID);
        if (!name2 || !age2 || !phone2 || !bloodgroup2) {
            console.log("error in request form");
            return res.json({ error: "please fill the data carefully" });
        }

        const userContact = await User.findOne({ _id: req.userID });
        console.log(userContact);

        if (userContact) {
            const userRequests = await userContact.addRequest(name2, age2, phone2, bloodgroup2, type, stat);
            await userContact.save();
            res.status(201).json({ message: "request sent successfully" });
        }

    }
    catch (err) {
        console.log(err);
    }

});

router.post('/requestapi', authenticate, async (req, res) => {

    try {

        const { name2, age2, phone2, bloodgroup2, type, stat } = req.body;

        if (!name2 || !age2 || !phone2 || !bloodgroup2) {
            console.log("error in request form");
            return res.json({ error: "please fill the data carefully" });
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {
            const userRequests = await userContact.addRequest(name2, age2, phone2, bloodgroup2, type, stat);
            await userContact.save();
            return res.status(201).json({ message: "request sent successfully" });
        }

    }
    catch (err) {
        console.log(err);
    }

});

router.post('/testapi', async (req, res) => {

    try {

        const { tid } = req.body;
        console.log(tid);

        if (!tid) {
            return res.status(400).json({ error: "id not found" });
        }
        else {

            const userReq = await User.findOne({ _id: tid });
            const newur = await userReq.changeStatus();
            newur.save();

            return res.status(200).json({ message: "success" });
        }

    }
    catch (err) {
        console.log(err);
    }

})

router.post('/postnotice', async (req, res) => {

    console.log(req.body);

    const { update } = req.body;

    if (!update) {

        return res.status(401).json({ erroe: "Please fill all the fields!" });

    }

    try {

        const notice = new Notice({update});

        const noticeRegister = await notice.save();

        if (noticeRegister) {
            return res.status(201).json({ message: "update sent successfully" });
        }
        else {
            return res.status(500).json({ error: "failed to send update" })
        }

    }
    catch (err) {
        console.log(err);
    }


})

module.exports = router;