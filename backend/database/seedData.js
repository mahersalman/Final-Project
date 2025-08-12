// ---- USERS (unchanged) ------------------------------------------------------
const sampleUsers = [
  { username: "admin", password: "admin", isAdmin: true, department: "מערכת" },
  {
    username: "manager",
    password: "secret123",
    isAdmin: false,
    department: "ייצור",
  },
  {
    username: "user1",
    password: "secret123",
    isAdmin: false,
    department: "בדיקה",
  },
  { username: "user2", password: "secret123", isAdmin: false, department: "" },
];

// ---- CANONICAL DEPARTMENTS USED ACROSS DATA ---------------------------------
const DEPARTMENTS = [
  "הרכבות 1",
  "הרכבות 2",
  "הרכבות אלקטרוניקה",
  "טלפוניה",
  "פלקס",
  "פרמהספט",
  "ייצור",
  "בדיקה",
  "אריזה",
];

// ---- PERSONS (names from screenshots; mix of statuses) ----------------------
const samplePersons = [
  {
    person_id: "EMP001",
    first_name: "ולדימיר",
    last_name: "סוריס",
    department: "הרכבות אלקטרוניקה",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP002",
    first_name: "אלכסנדר",
    last_name: "ליבינסקי",
    department: "הרכבות 1",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP003",
    first_name: "בוריס",
    last_name: "שטיינברג",
    department: "הרכבות 2",
    status: "לא פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP004",
    first_name: "אור",
    last_name: "חיים",
    department: "הרכבות אלקטרוניקה",
    status: "פעיל",
    role: "TeamLead",
  },
  {
    person_id: "EMP005",
    first_name: "אולה",
    last_name: "ארב",
    department: "בדיקה",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP006",
    first_name: "ישראל",
    last_name: "כהן",
    department: "פלקס",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP007",
    first_name: "נועה",
    last_name: "שמואלי",
    department: "פרמהספט",
    status: "פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP008",
    first_name: "יובל",
    last_name: "ברק",
    department: "טלפוניה",
    status: "מוקפא",
    role: "Employee",
  },
  {
    person_id: "EMP009",
    first_name: "דוד",
    last_name: "מזרחי",
    department: "אריזה",
    status: "לא פעיל",
    role: "Employee",
  },
  {
    person_id: "EMP010",
    first_name: "כבל",
    last_name: "תומס",
    department: "ייצור",
    status: "פעיל",
    role: "Employee",
  },
];

// ---- PRODUCTS (simple; used by stations) ------------------------------------
const sampleProducts = [
  { product_id: "PROD001", product_name: "שסתום A", company: "Migdalor" },
  { product_id: "PROD002", product_name: "שסתום B", company: "Migdalor" },
];

// ---- STATIONS (as the UI shows on the right pane) ---------------------------
const sampleStations = [
  {
    station_id: "ST001",
    station_name: "ישר-אסיפות",
    department: "הרכבות אלקטרוניקה",
    product_name: "שסתום A",
  },
  {
    station_id: "ST002",
    station_name: "ישר-מכונה",
    department: "הרכבות אלקטרוניקה",
    product_name: "שסתום A",
  },
  {
    station_id: "ST003",
    station_name: "ישר-ריתוך",
    department: "הרכבות 1",
    product_name: "שסתום B",
  },
  // keep the generic ones from the old app if other screens still reference them:
  {
    station_id: "ST004",
    station_name: "עמדת בדיקה",
    department: "בדיקה",
    product_name: "שסתום B",
  },
  {
    station_id: "ST005",
    station_name: "עמדת אריזה",
    department: "אריזה",
    product_name: "שסתום B",
  },
];

// ---- WORKING STATIONS (must reference station_name 1:1 with sampleStations) -
const sampleWorkingStations = [
  // ישר-אסיפות
  {
    workingStation_name: "ישר-אסיפות 1",
    station_name: "ישר-אסיפות",
    status: true,
  },
  {
    workingStation_name: "ישר-אסיפות 2",
    station_name: "ישר-אסיפות",
    status: true,
  },
  // ישר-מכונה
  {
    workingStation_name: "ישר-מכונה 1",
    station_name: "ישר-מכונה",
    status: false,
  }, // intentionally inactive for dashboard
  // ישר-ריתוך
  {
    workingStation_name: "ישר-ריתוך 1",
    station_name: "ישר-ריתוך",
    status: true,
  },
  // עמדת בדיקה
  {
    workingStation_name: "בדיקה B-1",
    station_name: "עמדת בדיקה",
    status: true,
  },
  // עמדת אריזה
  {
    workingStation_name: "אריזה C-1",
    station_name: "עמדת אריזה",
    status: false,
  }, // another inactive
];

// ---- QUALIFICATIONS (employee ↔ station skill avg, as your modal shows) -----
const sampleQualifications = [
  // אור חיים – strong in electronics assembly
  { person_id: "EMP004", station_name: "ישר-אסיפות", avg: 92 },
  { person_id: "EMP004", station_name: "ישר-מכונה", avg: 88 },

  // ולדימיר סוריס
  { person_id: "EMP001", station_name: "ישר-אסיפות", avg: 85 },
  { person_id: "EMP001", station_name: "עמדת בדיקה", avg: 74 },

  // אלכסנדר ליבינסקי
  { person_id: "EMP002", station_name: "ישר-ריתוך", avg: 80 },

  // בוריס שטיינברג (לא פעיל – עדיין יש היסטוריה)
  { person_id: "EMP003", station_name: "עמדת בדיקה", avg: 70 },

  // אחרים
  { person_id: "EMP005", station_name: "עמדת בדיקה", avg: 76 },
  { person_id: "EMP006", station_name: "ישר-מכונה", avg: 79 },
  { person_id: "EMP007", station_name: "עמדת אריזה", avg: 81 },
];

// ---- ASSIGNMENTS (for daily table & reports) --------------------------------
const today = new Date();
today.setHours(9, 0, 0, 0);
const todayLate = new Date();
todayLate.setHours(14, 0, 0, 0);
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(9, 0, 0, 0);

const sampleAssignments = [
  // same employee two shifts (tests delete by ordinal 1/2 in UI)
  {
    assignment_id: "ASG001",
    date: today,
    number_of_hours: 4,
    workingStation_name: "ישר-אסיפות 1",
    person_id: "EMP004",
  },
  {
    assignment_id: "ASG002",
    date: todayLate,
    number_of_hours: 4,
    workingStation_name: "ישר-מכונה 1",
    person_id: "EMP004",
  },

  // other employees today
  {
    assignment_id: "ASG003",
    date: today,
    number_of_hours: 6,
    workingStation_name: "ישר-ריתוך 1",
    person_id: "EMP002",
  },
  {
    assignment_id: "ASG004",
    date: today,
    number_of_hours: 6,
    workingStation_name: "בדיקה B-1",
    person_id: "EMP005",
  },

  // yesterday (for date filtering & reports)
  {
    assignment_id: "ASG005",
    date: yesterday,
    number_of_hours: 8,
    workingStation_name: "אריזה C-1",
    person_id: "EMP009",
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
  DEPARTMENTS,
};
