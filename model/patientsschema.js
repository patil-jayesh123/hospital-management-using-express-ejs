const mongoose=require('mongoose')

const patientsschema=new mongoose.Schema({
    patient:String,
    age:Number,
    gender:String,
    contact:String,
    address:String
    
})

module.exports=mongoose.model('patient',patientsschema)