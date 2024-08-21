const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes after initializing app
const userRouter = require('./routes/users');
const Station = require('./models/station');
const Person = require('./models/person');
const Qualification = require('./models/qualification');
const Product = require('./models/product'); 

const mongoURI = "mongodb+srv://admin:Aa112233@migdalor.uqujiwf.mongodb.net/migdalor?retryWrites=true&w=majority&appName=migdalor";
console.log('Mongo URI:', mongoURI);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  console.log('Connected to database:', mongoose.connection.name);
  if (mongoose.connection.db.databaseName !== 'migdalor') {
    console.error('Warning: Connected to incorrect database. Expected "migdalor", got "' + mongoose.connection.db.databaseName + '"');
  }
})
.catch(err => console.log(err));

// Define Routes
app.use('/users', userRouter);

//get all stations
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

//get all employees
app.get('/api/employees', async (req, res) => {
  try {
    console.log('Attempting to fetch persons...');
    const employees = await Person.find({});
    console.log('Fetched persons:', employees);
    console.log('Number of persons found:', employees.length);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

//route to save a person
app.post('/api/employees', async (req, res) => {
  try {
    const newPerson = new Person({
      person_id: req.body.person_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      department: req.body.department,
      role: req.body.role || 'Employee'
    });

    const savedPerson = await newPerson.save();
    console.log('New person saved:', savedPerson);
    res.status(201).json(savedPerson);
  } catch (error) {
    console.error('Error saving person:', error);
    res.status(500).json({ message: 'Error saving person', error: error.message });
  }
});

//save new qualications for employee
app.post('/api/qualifications', async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;
    const newQualification = new Qualification({
      person_id,
      station_name,
      avg
    });
    const savedQualification = await newQualification.save();
    res.status(201).json(savedQualification);
  } catch (error) {
    console.error('Error saving qualification:', error);
    res.status(500).json({ message: 'Error saving qualification', error: error.message });
  }
});

// Update or create employee qualifications
app.put('/api/qualifications', async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;
    console.log('Received qualification update request:', { person_id, station_name, avg });

    // First, find the person by their person_id
    const person = await Person.findOne({ person_id });
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Find and update the qualification, or create a new one if it doesn't exist
    const qualification = await Qualification.findOneAndUpdate(
      { person_id: person.person_id, station_name },
      { avg },
      { new: true, upsert: true }
    );

    console.log('Qualification updated:', qualification);
    res.json(qualification);
  } catch (error) {
    console.error('Error updating qualification:', error);
    res.status(500).json({ message: 'Error updating qualification', error: error.message });
  }
});



// Get employee qualifications
app.get('/api/qualifications/:employeeId', async (req, res) => {
  try {
    console.log('Fetching qualifications for employeeId:', req.params.employeeId);
    const qualifications = await Qualification.find({ person_id: req.params.employeeId });
    console.log('Qualifications found:', qualifications);
    res.json(qualifications);
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    res.status(500).json({ message: 'Error fetching qualifications', error: error.message });
  }
});

// Update employee data
app.put('/api/employees/:employeeId', async (req, res) => {
  try {
    const updatedEmployee = await Person.findOneAndUpdate(
      { person_id: req.params.employeeId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Get all products 
app.get('/api/products', async (req, res) => {
  try {
    console.log('Attempting to fetch products...');
    const products = await Product.find({}).select('product_name');
    console.log('Fetched products:', products);
    console.log('Number of products found:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});