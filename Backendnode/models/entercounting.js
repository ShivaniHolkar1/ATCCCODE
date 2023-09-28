const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const entercountingSchema = mongoose.Schema({
    vehicletype:String,
    date:String,
    time:String,
    cameratype:String,
    location:String,
    speed:String
    
   
})
        
    
const EnterCounting = mongoose.model('EnterCounting',entercountingSchema)

module.exports= EnterCounting