const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const exitvehicleclassSchema = mongoose.Schema({
    vehicletype:String,
    date:String,
    count:String,
    cameratype:String,
    location:String,
    averageSpeed:String
   
})
        
    
const ExitVehicleClass = mongoose.model('ExitVehicleClass',exitvehicleclassSchema)

module.exports= ExitVehicleClass