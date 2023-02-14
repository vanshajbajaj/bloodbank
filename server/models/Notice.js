const mongoose=require('mongoose');

const noticeSchema=new mongoose.Schema({
    update:{
        type:String,
        required:true
    }
});

const Notice=mongoose.model('notices',noticeSchema);
module.exports = Notice;