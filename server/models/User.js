const mongoose=require('mongoose');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    bloodgroup:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    requests:[
        {
            name2:{
                type:String,
                required:true
            },
            age2:{
                type:Number,
                required:true
            },
            phone2:{
                type:Number,
                required:true
            },
            bloodgroup2:{
                type:String,
                required:true
            },
            type:{
                type:Boolean,
                required:true
            },
            stat:{
                type:Boolean,
                required:true
            }
        }
    ],
    tokens:[
        {

            token:{
                type:String,
                required:true
            }
            
        }
    ]

})

userSchema.methods.generateAuthToken=async function(){

    try{

        const token=jwt.sign({_id:this._id},"MYNAMEISVANSHAJBAJAJANDIAMNOTATERRORIST");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    }
    catch(err){
        console.log(err);
    }

}

userSchema.methods.addRequest=async function(name2,age2,phone2,bloodgroup2,type,stat){

    try{

        this.requests=this.requests.concat({name2,age2,phone2,bloodgroup2,type,stat});
        await this.save();
        return this.requests;

    }
    catch(err){
        console.log(err);
    }

}

userSchema.methods.changeStatus=async function(tid){

    try{

        this.stat=true;
        await this.save();
        return this.stat;

    }
    catch(err){
        console.log(err);
    }

}

userSchema.pre('save',async function(next){

    if(this.isModified('password')){

        this.password=await bcryptjs.hash(this.password,12);
        this.cpassword=await bcryptjs.hash(this.cpassword,12);

    }
    next();

})

const User=mongoose.model('users',userSchema);
module.exports = User;