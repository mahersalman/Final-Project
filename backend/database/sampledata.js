// seedData.js
const sampleUsers = [
  // Admin
  {
    username: "admin",
    password: "admin",
    isAdmin: true,
    department: "מערכת",
  },
  // Department manager (plain text; your login supports plain for backward-compat)
  {
    username: "manager",
    password: "secret123",
    isAdmin: false,
    department: "ייצור",
  },
  // Regular user (active department)
  {
    username: "user1",
    password: "secret123",
    isAdmin: false,
    department: "בדיקה",
  },
  // Regular user (no department)
  {
    username: "user2",
    password: "secret123",
    isAdmin: false,
    department: "",
  },
];

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
    department: "בדיקה",
    status: "לא פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP004",
    first_name: "אור",
    last_name: "ברק",
    department: "אריזה",
    status: "פעיל",
    role: "TeamLead",
  },
  {
    person_id: "EMP005",
    first_name: "נועה",
    last_name: "שמואלי",
    department: "ייצור",
    status: "פעיל",
    role: "Employee",
  },
];

const sampleStations = [
  {
    station_id: "ST001",
    station_name: "עמדת הרכבה",
    department: "ייצור",
    product_name: "שסתום A",
  },
  {
    station_id: "ST002",
    station_name: "עמדת בדיקה",
    department: "בדיקה",
    product_name: "שסתום A",
  },
  {
    station_id: "ST003",
    station_name: "עמדת אריזה",
    department: "אריזה",
    product_name: "שסתום B",
  },
  {
    station_id: "ST004",
    station_name: "עמדת כיול",
    department: "בדיקה",
    product_name: "שסתום B",
  },
];

const sampleWorkingStations = [
  // For עמדת הרכבה
  {
    workingStation_name: "הרכבה A-1",
    station_name: "עמדת הרכבה",
    status: true,
  },
  {
    workingStation_name: "הרכבה A-2",
    station_name: "עמדת הרכבה",
    status: true,
  },
  // For עמדת בדיקה
  {
    workingStation_name: "בדיקה B-1",
    station_name: "עמדת בדיקה",
    status: true,
  },
  // For עמדת אריזה
  {
    workingStation_name: "אריזה C-1",
    station_name: "עמדת אריזה",
    status: false,
  },
  // For עמדת כיול
  { workingStation_name: "כיול D-1", station_name: "עמדת כיול", status: true },
];

const sampleProducts = [
  { product_id: "PROD001", product_name: "שסתום A", company: "Migdalor" },
  { product_id: "PROD002", product_name: "שסתום B", company: "Migdalor" },
  { product_id: "PROD003", product_name: "שסתום C", company: "PartnerCo" },
];

const sampleQualifications = [
  // EMP001
  { person_id: "EMP001", station_name: "עמדת הרכבה", avg: 85 },
  { person_id: "EMP001", station_name: "עמדת בדיקה", avg: 75 },
  // EMP002
  { person_id: "EMP002", station_name: "עמדת הרכבה", avg: 90 },
  { person_id: "EMP002", station_name: "עמדת אריזה", avg: 80 },
  // EMP003 (inactive employee, still has past quals)
  { person_id: "EMP003", station_name: "עמדת בדיקה", avg: 70 },
  // EMP004 (team lead, strong quals)
  { person_id: "EMP004", station_name: "עמדת הרכבה", avg: 92 },
  { person_id: "EMP004", station_name: "עמדת כיול", avg: 88 },
  // EMP005 (missing some quals to test sorting/eligibility)
  { person_id: "EMP005", station_name: "עמדת הרכבה", avg: 78 },
];

const today = new Date();
today.setHours(10, 0, 0, 0);

const todayLater = new Date(today);
todayLater.setHours(15, 0, 0, 0);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(9, 0, 0, 0);

const sampleAssignments = [
  // Two assignments for same person on the same day (to test delete by ordinal 1/2)
  {
    assignment_id: "ASG001",
    date: today,
    number_of_hours: 4,
    workingStation_name: "הרכבה A-1",
    person_id: "EMP001",
  },
  {
    assignment_id: "ASG002",
    date: todayLater,
    number_of_hours: 4,
    workingStation_name: "בדיקה B-1",
    person_id: "EMP001",
  },
  // Another person today
  {
    assignment_id: "ASG003",
    date: today,
    number_of_hours: 6,
    workingStation_name: "הרכבה A-2",
    person_id: "EMP002",
  },
  // Yesterday’s data (for date filtering in /api/assignments and /api/report)
  {
    assignment_id: "ASG004",
    date: yesterday,
    number_of_hours: 8,
    workingStation_name: "אריזה C-1",
    person_id: "EMP005",
  },
];

module.exports = {
  sampleUsers,
  samplePersons,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
};
