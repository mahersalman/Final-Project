const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); // Initialize app before using it

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes after initializing app
const userRouter = require('./routes/users');

const mongoURI = "mongodb+srv://admin:Aa112233@migdalor.uqujiwf.mongodb.net/?retryWrites=true&w=majority&appName=migdalor";

console.log('Mongo URI:', mongoURI);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


// Define Routes
app.use('/users', userRouter); // Use the app object after initialization

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
