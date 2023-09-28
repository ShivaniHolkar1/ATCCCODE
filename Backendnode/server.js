const express = require('express');
// const session = require('express-session')
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = mongoose.connection;
const server = require('http').createServer(app);

const entercountingRouter = require('./routers/entercounting')
const entervehicleclassRouter = require('./routers/entervehicleclass');
const exitcountingRouter = require('./routers/exitcounting')
const exitvehicleclassRouter = require('./routers/exitvehicleclass');



// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/ATCC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database!');
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(entercountingRouter)
app.use(entervehicleclassRouter)
app.use(exitcountingRouter)
app.use(exitvehicleclassRouter)



// Start the server
const port = process.env.PORT || 5050;
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
