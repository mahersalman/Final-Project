const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mqtt = require('mqtt');
const geneticAlgorithm = require('./GeneticAlgorithm.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

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

// MQTT Client setup
const mqttBroker = 'mqtt://test.mosquitto.org'; // Replace with MQTT broker address
const mqttClient = mqtt.connect(mqttBroker);

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to topics
  mqttClient.subscribe('Braude/Shluker/', (err) => {
    if (!err) {
      console.log('Subscribed to Braude/Shluker/');
    }
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  // Handle incoming messages here
});

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
    console.log('Fetching employees...');
    const employees = await Person.find({});
    console.log('Employees found:', employees.length);
    console.log('Sample employee:', employees[0]);
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
      status: req.body.status,
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

//get all qualifications
app.get('/api/qualifications', async (req, res) => {
  try {
    console.log('Fetching qualifications...');
    const qualifications = await Qualification.find({});
    console.log('Qualifications found:', qualifications.length);
    console.log('Sample qualification:', qualifications[0]);
    res.json(qualifications);
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    res.status(500).json({ message: 'Error fetching qualifications', error: error.message });
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
    const { department, status } = req.body;
    
    // Prepare the update object
    const updateObj = {};
    if (department) updateObj.department = department;
    if (status) updateObj.status = status;

    const updatedEmployee = await Person.findOneAndUpdate(
      { person_id: req.params.employeeId },
      { $set: updateObj },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // If status has changed, log the change
    if (status && updatedEmployee.status !== status) {
      console.log(`Employee ${updatedEmployee.person_id} status changed from ${updatedEmployee.status} to ${status}`);
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});

// route for dashboard data
app.get('/api/dashboard-data', async (req, res) => {
  try {
    console.log('Received request for dashboard data');
    const currentDate = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    console.log('Current date:', currentDate, 'Yesterday:', yesterdayDate);

    // Calculate inactive and active workers
    const totalWorkers = await Person.countDocuments();
    console.log('Total workers:', totalWorkers);
    
    const activeWorkersToday = await Assignment.distinct('personID', { date: currentDate }).length;
    console.log('Active workers today:', activeWorkersToday);
    
    const inactiveWorkers = totalWorkers - activeWorkersToday;
    console.log('Inactive workers:', inactiveWorkers);

    // Calculate new active workers
    const activeWorkersYesterday = await Assignment.distinct('personID', { date: yesterdayDate }).length;
    console.log('Active workers yesterday:', activeWorkersYesterday);
    
    const newActiveWorkers = Math.max(0, activeWorkersToday - activeWorkersYesterday);
    console.log('New active workers:', newActiveWorkers);

    // Calculate inactive stations
    const totalStations = await Station.countDocuments();
    console.log('Total stations:', totalStations);
    
    const activeStations = await Assignment.distinct('stationName', { date: currentDate }).length;
    console.log('Active stations:', activeStations);
    
    const inactiveStations = totalStations - activeStations;
    console.log('Inactive stations:', inactiveStations);

    // TODO: Implement daily defects calculation when the requirement is defined

    const responseData = {
      inactiveWorkers,
      activeWorkers: activeWorkersToday,
      newActiveWorkers,
      dailyDefects: 0, // Placeholder until requirement is defined
      inactiveStations
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error calculating dashboard data:', error);
    // Ensure we're sending a JSON response even in case of an error
    res.status(500).json({ 
      message: 'Error calculating dashboard data', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
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

app.post('/api/assign-employees', async (req, res) => {
  try {
    const { selectedStations, selectedEmployees } = req.body;
    
    // Fetch full employee data
    const employees = await Person.find({ _id: { $in: selectedEmployees } });
    
    // Fetch full station data
    const stations = await Station.find({ _id: { $in: selectedStations } });
    
    // Fetch qualifications for selected employees
    const qualifications = await Qualification.find({ person_id: { $in: selectedEmployees } });
    
    // Run genetic algorithm
    const bestAssignment = geneticAlgorithm(employees, stations, qualifications);
    
    // Create a detailed assignment object
    const detailedAssignment = {};
    Object.entries(bestAssignment).forEach(([stationId, employeeId]) => {
      const station = stations.find(s => s.station_id === stationId);
      const employee = employees.find(e => e._id.toString() === employeeId);
      const qualification = qualifications.find(q => 
        q.person_id === employeeId && q.station_name === station.station_name
      );
      detailedAssignment[employeeId] = {
        stationId,
        stationName: station.station_name,
        qualificationScore: qualification ? qualification.avg : 0
      };
    });
    
    res.json(detailedAssignment);
  } catch (error) {
    console.error('Error assigning employees:', error);
    res.status(500).json({ message: 'Error assigning employees', error: error.message });
  }
});