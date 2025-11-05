const mongoose=require('mongoose')
const userdataschema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
})

module.exports=mongoose.model('userdata',userdataschema)