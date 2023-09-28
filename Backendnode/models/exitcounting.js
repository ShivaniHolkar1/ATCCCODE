const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const exitcountingSchema = mongoose.Schema({
    vehicletype:String,
    date:String,
    time:String,
    cameratype:String,
    location:String,
    speed:String
   
})
        
    
const ExitCounting = mongoose.model('ExitCounting',exitcountingSchema)

module.exports= ExitCounting