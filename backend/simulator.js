// Simple MQTT simulator for Migdalor backend
// Publishes JSON messages compatible with backend expectations and subscriptions

/*
How to use:
  1) Ensure environment variable MQTT_BROKER is set (e.g., mqtt://localhost:1883 or mqtts://host:8883)
  2) Optionally set:
     - SIM_TOPIC_PREFIX (default: "Braude/Shluker")
     - SIM_STATION (default: "Station-1")
     - SIM_USER_ID (default: "E001")
     - SIM_COUNT (number of messages to send per tick, default: 10)
     - SIM_TICKS (number of ticks to run, default: 1; use 0 for infinite)
     - SIM_INTERVAL_MS (interval between ticks, default: 1000)
     - SIM_RESULT_BIAS (0..1 probability for Good vs Invalid, default: 0.8)
  3) Run: node backend/simulator.js
*/

const mqtt = require("mqtt");

const mqttBroker = "mqtt://broker.hivemq.com";
if (!mqttBroker) {
  console.error("❌ MQTT_BROKER environment variable is not set");
  process.exit(1);
}

const topic = "Braude/Shluker/Station-1"; // topic remains for subscription; payload will include station_id

const client = mqtt.connect(mqttBroker);

client.on("connect", () => {
  console.log(`🟢 Connected to ${mqttBroker}`);
  console.log(`➡️  Publishing to ${topic}`);
  startPublishing();
});

client.on("error", (err) => {
  console.error("🔴 MQTT error:", err);
});

// Using seeded stations for payload consistency

const messages = [
  { "Shluker Result": "Good Valve", "User ID": "EMP001", station_id: "ST001" },
  { "Shluker Result": "Good Valve", "User ID": "EMP001", station_id: "ST001" },
  { "Shluker Result": "Good Valve", "User ID": "EMP002", station_id: "ST002" },
  { "Shluker Result": "Good Valve", "User ID": "EMP002", station_id: "ST002" },
  { "Shluker Result": "Good Valve", "User ID": "EMP003", station_id: "ST003" },
  { "Shluker Result": "Good Valve", "User ID": "EMP003", station_id: "ST003" },
  {
    "Shluker Result": "Invalid Valve",
    "User ID": "EMP004",
    station_id: "ST001",
  },
  {
    "Shluker Result": "Invalid Valve",
    "User ID": "EMP002",
    station_id: "ST002",
  },
  {
    "Shluker Result": "Invalid Valve",
    "User ID": "EMP003",
    station_id: "ST003",
  },
  {
    "Shluker Result": "Invalid Valve",
    "User ID": "EMP004",
    station_id: "ST001",
  },
];

function startPublishing() {
  let idx = 0;
  const timer = setInterval(() => {
    if (idx >= messages.length) {
      clearInterval(timer);
      console.log("✅ Done. Closing connection...");
      client.end();
      return;
    }
    const payload = JSON.stringify(messages[idx]);
    client.publish(topic, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error("❌ Publish error:", err);
      } else {
        console.log(`📤 Sent #${idx + 1}: ${payload}`);
      }
    });
    idx += 1;
  }, 200);
}
