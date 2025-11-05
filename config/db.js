const mongoose=require('mongoose')
const connection=async()=>{
    try{
        await mongoose.connect('mongodb+srv://jayeshpatilAtlas:Jayu8262@cluster0.9in5uyp.mongodb.net/HDB')
        console.log('db connection done ✅');
        console.log(mongoose.connection.readyState);       
        
    }catch(err){

        console.log('db connection failed');
        console.log(mongoose.connection.readyState);       

    }
}

connection()

module.exports={connection}