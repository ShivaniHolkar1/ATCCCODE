const express = require('express')
const router = new express.Router()
const ExitVehicleClass = require('../models/exitvehicleclass')
const ExitCounting = require('../models/exitcounting')
const cron = require('node-cron');

// Function to process and update EnterVehicleClass table

const processAndUpdateExitVehicleClass = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; 
      const exitCountingData = await ExitCounting.find({ date: currentDate });
  
      // Initialize counters for each vehicle type
      const vehicleTypes = ['car', 'bus', 'truck', 'bike'];
      const counts = {
        car: 0,
        bus: 0,
        truck: 0,
        bike: 0
      };
      const totalSpeeds = {
        car: 0,
        bus: 0,
        truck: 0,
        bike: 0
      };
  
      // Process the exitCountingData to calculate counts and total speeds for each vehicle type
      exitCountingData.forEach(exit => {
        const vehicleType = exit.vehicletype;
        if (vehicleTypes.includes(vehicleType)) {
          counts[vehicleType]++;
          totalSpeeds[vehicleType] += parseFloat(exit.speed);
        }
      });
  
      // Calculate average speeds for each vehicle type
      const averageSpeeds = {};
      vehicleTypes.forEach(vehicleType => {
        if (counts[vehicleType] > 0) {
          averageSpeeds[vehicleType] = totalSpeeds[vehicleType] / counts[vehicleType];
        }
      });
  
      // Update EnterVehicleClass entries for each vehicle type
      for (const vehicleType of vehicleTypes) {
        await ExitVehicleClass.findOneAndUpdate(
          { vehicletype: vehicleType, date: currentDate },
          {
            count: counts[vehicleType].toString(),
            averageSpeed: averageSpeeds[vehicleType] ? averageSpeeds[vehicleType].toFixed(2) : '0.00',
            cameratype: exitCountingData[0]?.cameratype || 'unknown',
            location: exitCountingData[0]?.location || 'unknown'
          },
          { upsert: true }
        );
      }
  
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };
  
  // Schedule the function to run every 5 seconds
  cron.schedule('*/5 * * * * *', async () => {
    await processAndUpdateExitVehicleClass();
  });




router.post('/exitvehicleclass', async (req, res) => {
  try {
      const exitvehicleclass = new ExitVehicleClass({
        vehicletype:req.body.vehicletype,
        date:req.body.date,
        count:req.body.date,
        cameratype:req.body.cameratype,
        location:req.body.location,
        averageSpeed:req.body.averageSpeed 
})
      const result = await exitvehicleclass.save();
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({
          error: err.message
      });
  }
});


router.get('/exitvehicleclass',(req,res)=>{
    ExitVehicleClass.find()
    .then(result=>{
     res.status(200).json(
    result
    )
}).catch(err=>{
    console.log(err)
    res.status(500).json({
    error:err
    })
   })
})

// Route to fetch ExitVehicleClass data by date
router.get('/exitvehicleclassByDate', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  ExitVehicleClass.find({ date: date })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    });
});

// Route to fetch ExitVehicleClass data for the current hour
router.get('/exitvehicleclassForCurrentHour', async (req, res) => {
  const currentHour = new Date().getHours();

  const currentDate = new Date().toISOString().split('T')[0]; 

  try {
    const result = await ExitVehicleClass.find({
      date: currentDate,
      $and: [
        { time: { $gte: `${currentHour}:00:00` } },   // Greater than or equal to current hour
        { time: { $lt: `${currentHour + 1}:00:00` } } // Less than next hour
      ]
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


module.exports = router