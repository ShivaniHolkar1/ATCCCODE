const express = require('express')
const router = new express.Router()
const EnterVehicleClass = require('../models/entervehicleclass')
const EnterCounting = require('../models/entercounting')
const cron = require('node-cron');

// Function to process and populate EnterVehicleClass table
const processAndPopulateEnterVehicleClass = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
      const enterCountingData = await EnterCounting.find({ date: currentDate });
  
      // Initialize counters and accumulators for each vehicle type
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
  
      // Process the enterCountingData to calculate counts and total speeds for each vehicle type
      enterCountingData.forEach(entry => {
        const vehicleType = entry.vehicletype;
        if (vehicleTypes.includes(vehicleType)) {
          counts[vehicleType]++;
          totalSpeeds[vehicleType] += parseFloat(entry.speed);
        }
      });
  
      // Calculate average speeds for each vehicle type
      const averageSpeeds = {};
      vehicleTypes.forEach(vehicleType => {
        if (counts[vehicleType] > 0) {
          averageSpeeds[vehicleType] = totalSpeeds[vehicleType] / counts[vehicleType];
        }
      });
  
      // Update or create EnterVehicleClass entries for each vehicle type
      for (const vehicleType of vehicleTypes) {
        const existingEntry = await EnterVehicleClass.findOne({ vehicletype: vehicleType, date: currentDate });

        if (existingEntry) {
          // Update existing entry
          existingEntry.count = counts[vehicleType].toString();
          if (averageSpeeds[vehicleType] !== undefined) {
            existingEntry.averageSpeed = averageSpeeds[vehicleType].toFixed(2);
          }
          await existingEntry.save();
        } else {
          // Create new entry
          const vehicleClassEntry = new EnterVehicleClass({
            vehicletype: vehicleType,
            date: currentDate,
            count: counts[vehicleType].toString(),
            averageSpeed: averageSpeeds[vehicleType] !== undefined ? averageSpeeds[vehicleType].toFixed(2) : '0.00',
            cameratype: enterCountingData[0]?.cameratype || 'unknown',
            location: enterCountingData[0]?.location || 'unknown'
          });

          await vehicleClassEntry.save();
        }
      }
  
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };
  
  // Schedule the function to run every 5 seconds
  cron.schedule('*/5 * * * * *', async () => {
    await processAndPopulateEnterVehicleClass();
  });


router.post('/entervehicleclass', async (req, res) => {
  try {
      const entervehicleclass = new EnterVehicleClass({
        vehicletype:req.body.vehicletype,
        date:req.body.date,
        count:req.body.count,
        cameratype:req.body.cameratype,
        location:req.body.location,
        averageSpeed:req.body.averageSpeed
})
      const result = await entervehicleclass.save();
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({
          error: err.message
      });
  }
});


router.get('/entervehicleclass',(req,res)=>{
    EnterVehicleClass.find()
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

// Route to fetch EnterVehicleClass data by date
router.get('/entervehicleclassByDate', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  EnterVehicleClass.find({ date: date })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    });
});



// Route to fetch EnterCounting data for the current hour
router.get('/entervehicleclassForCurrentHour', async (req, res) => {
  const currentHour = new Date().getHours();

  const currentDate = new Date().toISOString().split('T')[0]; 

  try {
    const result = await EnterVehicleClass.find({
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