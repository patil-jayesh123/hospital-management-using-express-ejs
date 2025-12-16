const mongoose=require('mongoose')
const appointmentschema=new mongoose.Schema({
    patient:String,
    doctor:String,
    date:String,
    time:String,
    department:String
})

module.exports=mongoose.model('apoinment',appointmentschema,'apoinment')