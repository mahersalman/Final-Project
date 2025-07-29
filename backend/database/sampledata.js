const { model } = require("mongoose");

const samplePersons = [
  {
    person_id: "EMP001",
    first_name: "יוסי",
    last_name: "כהן",
    department: "ייצור",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP002",
    first_name: "שרה",
    last_name: "לוי",
    department: "ייצור",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP003",
    first_name: "דוד",
    last_name: "מזרחי",
    department: "ייצור",
    status: "לא פעיל",
    role: "Employee",
  },
];

const sampleStations = [
  {
    station_id: "ST001",
    station_name: "עמדת הרכבה",
    description: "עמדה להרכבת רכיבים",
  },
  {
    station_id: "ST002",
    station_name: "עמדת בדיקה",
    description: "עמדה לבדיקת איכות",
  },
  {
    station_id: "ST003",
    station_name: "עמדת אריזה",
    description: "עמדה לאריזת מוצרים",
  },
];

const sampleWorkingStations = [
  {
    workingStation_name: "הרכבה A",
    station_name: "עמדת הרכבה",
    capacity: 2,
    equipment: "מכונת הרכבה אוטומטית",
  },
  {
    workingStation_name: "בדיקה B",
    station_name: "עמדת בדיקה",
    capacity: 1,
    equipment: "מכונת בדיקה ממוחשבת",
  },
];

const sampleProducts = [
  {
    product_id: "PROD001",
    product_name: "שסתום A",
    description: "שסתום סטנדרטי",
  },
  {
    product_id: "PROD002",
    product_name: "שסתום B",
    description: "שסתום מתקדם",
  },
];

const sampleQualifications = [
  {
    person_id: "EMP001",
    station_name: "עמדת הרכבה",
    avg: 85,
  },
  {
    person_id: "EMP001",
    station_name: "עמדת בדיקה",
    avg: 75,
  },
  {
    person_id: "EMP002",
    station_name: "עמדת הרכבה",
    avg: 90,
  },
  {
    person_id: "EMP002",
    station_name: "עמדת אריזה",
    avg: 80,
  },
];

const sampleAssignments = [
  {
    assignment_id: "ASG001",
    date: new Date(),
    number_of_hours: 8,
    workingStation_name: "הרכבה A",
    person_id: "EMP001",
  },
  {
    assignment_id: "ASG002",
    date: new Date(),
    number_of_hours: 6,
    workingStation_name: "בדיקה B",
    person_id: "EMP002",
  },
];

module.exports = {
  samplePersons,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
};
