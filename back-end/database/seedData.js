// ---- USERS (unchanged) ------------------------------------------------------

// seedData.js (users section)
// All passwords are plain here and will be bcrypt-hashed in setupDatabase

const sampleUsers = [
  // ---- Admin (website admin only) ----
  {
    person_id: "EMP000",
    username: "admin",
    password: "admin",
    first_name: "System",
    last_name: "Admin",
    email: "admin@migdalor.local",
    phone: "+972500000000",
    department: "פלקס",
    role: "Admin",
    status: "פעיל",
    isAdmin: true,
  },

  // ---- Persons merged as users ----
  {
    person_id: "EMP001",
    username: "EMP001",
    password: "secret123",
    first_name: "ולדימיר",
    last_name: "סוריס",
    email: "emp001@migdalor.local",
    phone: "+972500000001",
    department: "פלקס",
    role: "Employee",
    status: "פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP002",
    username: "EMP002",
    password: "secret123",
    first_name: "אלכסנדר",
    last_name: "ליבינסקי",
    email: "emp002@migdalor.local",
    phone: "+972500000002",
    department: "הרכבות 1",
    role: "Employee",
    status: "פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP003",
    username: "EMP003",
    password: "secret123",
    first_name: "בוריס",
    last_name: "שטיינברג",
    email: "emp003@migdalor.local",
    phone: "+972500000003",
    department: "הרכבות 2",
    role: "Employee",
    status: "לא פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP004",
    username: "EMP004",
    password: "secret123",
    first_name: "אור",
    last_name: "חיים",
    email: "emp004@migdalor.local",
    phone: "+972500000004",
    department: "פלקס",
    role: "TeamLead",
    status: "פעיל",
    isAdmin: false, // set true if TLs should be admins
  },
  {
    person_id: "EMP005",
    username: "EMP005",
    password: "secret123",
    first_name: "אולה",
    last_name: "ארב",
    email: "emp005@migdalor.local",
    phone: "+972500000005",
    department: "פלקס",
    role: "Employee",
    status: "פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP006",
    username: "EMP006",
    password: "secret123",
    first_name: "ישראל",
    last_name: "כהן",
    email: "emp006@migdalor.local",
    phone: "+972500000006",
    department: "פלקס",
    role: "Employee",
    status: "פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP007",
    username: "EMP007",
    password: "secret123",
    first_name: "נועה",
    last_name: "שמואלי",
    email: "emp007@migdalor.local",
    phone: "+972500000007",
    department: "פרמהספט",
    role: "Employee",
    status: "פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP008",
    username: "EMP008",
    password: "secret123",
    first_name: "יובל",
    last_name: "ברק",
    email: "emp008@migdalor.local",
    phone: "+972500000008",
    department: "טלפוניה",
    role: "Employee",
    status: "מוקפא",
    isAdmin: false,
  },
  {
    person_id: "EMP009",
    username: "EMP009",
    password: "secret123",
    first_name: "דוד",
    last_name: "מזרחי",
    email: "emp009@migdalor.local",
    phone: "+972500000009",
    department: "פלקס",
    role: "Employee",
    status: "לא פעיל",
    isAdmin: false,
  },
  {
    person_id: "EMP010",
    username: "EMP010",
    password: "secret123",
    first_name: "כבל",
    last_name: "תומס",
    email: "emp010@migdalor.local",
    phone: "+972500000010",
    department: "פלקס",
    role: "Employee",
    status: "פעיל",
    isAdmin: false,
  },
];

// ---- CANONICAL DEPARTMENTS USED ACROSS DATA ---------------------------------
const DEPARTMENTS = [
  "הרכבות 1",
  "הרכבות 2",
  "הרכבות אלקטרוניקה",
  "טלפוניה",
  "פלקס",
  "פרמהספט",
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
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
  DEPARTMENTS,
};

// --- MQTT historical sample messages (for reports) ---------------------------
// Only IDs are used: station_id and "User ID". Results are Good/Invalid.
// We'll export a helper that builds messages with proper timestamps.

function buildMqttSeedMessages() {
  // Hardcoded dates at 10:00 local time
  const d = (y, m, day) => {
    const t = new Date(y, m - 1, day, 10, 0, 0, 0);
    return t;
  };

  const AUG20 = d(2025, 8, 20);
  const AUG22 = d(2025, 8, 22);
  const JUL01 = d(2025, 7, 1);
  const JUL10 = d(2025, 7, 10);
  const JUL25 = d(2025, 7, 25);

  const messages = [];

  const build = (topic, userId, stationId, result, ts) => ({
    topic,
    message: JSON.stringify({
      "Shluker Result": result,
      "User ID": userId,
      station_id: stationId,
    }),
    timestamp: ts,
    station_id: stationId,
    user_id: userId,
  });

  // 20.08.2025: ST001 (EMP001 2 good, 1 invalid), ST002 (EMP002 1 good)
  messages.push(
    build("Braude/Shluker/Station-1", "EMP001", "ST001", "Good Valve", AUG20),
    build("Braude/Shluker/Station-1", "EMP001", "ST001", "Good Valve", AUG20),
    build(
      "Braude/Shluker/Station-1",
      "EMP001",
      "ST001",
      "Invalid Valve",
      AUG20
    ),
    build("Braude/Shluker/Station-2", "EMP002", "ST002", "Good Valve", AUG20)
  );

  // 22.08.2025: ST003 (EMP003 2 invalid), ST001 (EMP004 1 good)
  messages.push(
    build(
      "Braude/Shluker/Station-3",
      "EMP003",
      "ST003",
      "Invalid Valve",
      AUG22
    ),
    build(
      "Braude/Shluker/Station-3",
      "EMP003",
      "ST003",
      "Invalid Valve",
      AUG22
    ),
    build("Braude/Shluker/Station-1", "EMP004", "ST001", "Good Valve", AUG22)
  );

  // 01.07.2025: ST001 (EMP001 1 good), ST002 (EMP002 1 invalid), ST003 (EMP003 1 good)
  messages.push(
    build("Braude/Shluker/Station-1", "EMP001", "ST001", "Good Valve", JUL01),
    build(
      "Braude/Shluker/Station-2",
      "EMP002",
      "ST002",
      "Invalid Valve",
      JUL01
    ),
    build("Braude/Shluker/Station-3", "EMP003", "ST003", "Good Valve", JUL01)
  );

  // 10.07.2025: ST002 (EMP002 2 good), ST001 (EMP004 1 invalid)
  messages.push(
    build("Braude/Shluker/Station-2", "EMP002", "ST002", "Good Valve", JUL10),
    build("Braude/Shluker/Station-2", "EMP002", "ST002", "Good Valve", JUL10),
    build("Braude/Shluker/Station-1", "EMP004", "ST001", "Invalid Valve", JUL10)
  );

  // 25.07.2025: ST003 (EMP003 1 good), ST001 (EMP001 1 invalid), ST002 (EMP002 1 good)
  messages.push(
    build("Braude/Shluker/Station-3", "EMP003", "ST003", "Good Valve", JUL25),
    build(
      "Braude/Shluker/Station-1",
      "EMP001",
      "ST001",
      "Invalid Valve",
      JUL25
    ),
    build("Braude/Shluker/Station-2", "EMP002", "ST002", "Good Valve", JUL25)
  );

  return messages;
}

module.exports.buildMqttSeedMessages = buildMqttSeedMessages;
