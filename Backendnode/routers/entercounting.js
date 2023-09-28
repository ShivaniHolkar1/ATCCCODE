const express = require('express')
const router = new express.Router()
const EnterCounting = require('../models/entercounting')
const path = require('path')
const fs = require('fs')

router.post('/entercounting', async (req, res) => {
  try {
      const entercounting = new EnterCounting({
        vehicletype:req.body.vehicletype,
        date:req.body.date,
        time:req.body.time,
        cameratype:req.body.cameratype,
        location:req.body.location,
      speed:req.body.speed  
})
      const result = await entercounting.save();
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({
          error: err.message
      });
  }
});

// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: 'C:/videos', // Set the destination folder for uploaded files
//   filename: (req, file, cb) => {
//     // Generate a unique file name for the uploaded file
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, 'video-' + uniqueSuffix + '.mp4');
//   }
// });

// const upload = multer({ storage: storage });

// // Handle the POST request with data and video file
// router.post('/vdandcounting', upload.single('video'), (req, res) => {
//   // Access the uploaded video file using req.file
//   const videoPath = req.file.path;

//   // Access the other form data using req.body
//   const { vehicletype, noOfLeaving, noOfEntering, date, time, cameratype, location } = req.body;

//   // Create a new VdAndCounting document
//   const newEntry = new VdAndCounting({
//     vehicletype,
//     noOfLeaving,
//     noOfEntering,
//     date,
//     time,
//     cameratype,
//     location
//   });

//   // Save the new entry to the database
//   newEntry.save()
//     .then(savedEntry => {
//       res.status(200).json(savedEntry);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

  
router.get('/entercounting',(req,res)=>{
  EnterCounting.find()
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

// Route to fetch EnterCounting data by date
router.get('/entercountingByDate', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  EnterCounting.find({ date: date })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    });
});


// Route to fetch EnterCounting data for the current hour
router.get('/entercountingForCurrentHour', async (req, res) => {
  const currentHour = new Date().getHours();

  const currentDate = new Date().toISOString().split('T')[0]; 

  try {
    const result = await EnterCounting.find({
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




// // Function to fetch and send EnterCounting data
// // Route to fetch EnterCounting data
// router.get('/entercounting', (req, res) => {
// const fetchAndSendData = async () => {
//   try {
//     const result = await EnterCounting.find();
//     console.log('Fetched data at', new Date());
//     // Send the fetched data as a response
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     // Send an error response
//     res.status(500).json({ error: error.message || 'An error occurred' });
//   }

//   // Schedule the function to run again after 1 hour
//   setTimeout(fetchAndSendData, 60 * 60 * 1000); // 1 hour in milliseconds
// };
//   fetchAndSendData();
// });





module.exports = router