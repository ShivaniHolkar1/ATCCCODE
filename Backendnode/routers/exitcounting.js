const express = require('express')
const router = new express.Router()
const ExitCounting = require('../models/exitcounting')


router.post('/exitcounting', async (req, res) => {
  try {
      const  exitcounting = new ExitCounting({
        vehicletype:req.body.vehicletype,
        date:req.body.date,
        time:req.body.time,
        cameratype:req.body.cameratype,
        location:req.body.location,
        speed:req.body.speed
})
      const result = await exitcounting.save();
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({
          error: err.message
      });
  }
});


router.get('/exitcounting',(req,res)=>{
    ExitCounting.find()
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

// Route to fetch ExitCounting data by date
router.get('/exitcountingByDate', (req, res) => {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({ error: 'Missing date parameter' });
    }
  
    ExitCounting.find({ date: date })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
      });
  });
  
  
  // Route to fetch ExitCounting data for the current hour
router.get('/exitcountingForCurrentHour', async (req, res) => {
    const currentHour = new Date().getHours();
  
    const currentDate = new Date().toISOString().split('T')[0]; 
  
    try {
      const result = await ExitCounting.find({
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