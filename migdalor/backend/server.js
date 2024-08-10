const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); // Initialize app before using it

const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes after initializing app
const userRouter = require('./routes/users');
const Station = require('./models/station');

const mongoURI = "mongodb+srv://admin:Aa112233@migdalor.uqujiwf.mongodb.net/migdalor?retryWrites=true&w=majority&appName=migdalor";
console.log('Mongo URI:', mongoURI);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  // Log the name of the connected database
  console.log('Connected to database:', mongoose.connection.name);
  if (mongoose.connection.db.databaseName !== 'migdalor') {
    console.error('Warning: Connected to incorrect database. Expected "migdalor", got "' + mongoose.connection.db.databaseName + '"');
  }
})
.catch(err => console.log(err));


// Define Routes
app.use('/users', userRouter); // Use the app object after initialization


app.get('/api/stations', async (req, res) => {
  try {
    console.log('Attempting to fetch stations...');
    const stations = await Station.find({});
    console.log('Fetched stations:', stations);
    console.log('Number of stations found:', stations.length);
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ message: 'Error fetching stations', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


