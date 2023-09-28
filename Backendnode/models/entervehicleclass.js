const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const entervehicleclassSchema = mongoose.Schema({
    vehicletype:String,
    date:String,
    count:String,
    cameratype:String,
    location:String,
    averageSpeed:String
   
})
        
    
const EnterVehicleClass = mongoose.model('EnterVehicleClass',entervehicleclassSchema)

module.exports= EnterVehicleClass