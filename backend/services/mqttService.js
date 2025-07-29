const mqtt = require("mqtt");
const mongoose = require("mongoose");

let mqttClient = null;

function setupMQTT() {
  // MQTT Client setup
  const mqttBroker = process.env.MQTT_BROKER || "mqtt://test.mosquitto.org"; // Replace with MQTT broker address
  mqttClient = mqtt.connect(mqttBroker);

  mqttClient.on("connect", () => {
    console.log("🟢 Connected to MQTT broker");

    // Subscribe to topics
    mqttClient.subscribe("Braude/Shluker/#", (err) => {
      if (!err) {
        console.log("📡 Subscribed to Braude/Shluker/#");
      } else {
        console.error("❌ Failed to subscribe to MQTT topic:", err);
      }
    });
  });

  mqttClient.on("message", async (topic, message) => {
    console.log(`📨 Received message on topic ${topic}: ${message.toString()}`);

    // Save the message to the mqttMsg collection
    try {
      const newMessage = {
        topic: topic,
        message: message.toString(),
        timestamp: new Date(),
      };

      await mongoose.connection.db.collection("mqttMsg").insertOne(newMessage);
      console.log("💾 Message saved to mqttMsg collection");
    } catch (error) {
      console.error("❌ Error saving MQTT message to database:", error);
    }
  });

  mqttClient.on("error", (error) => {
    console.error("🔴 MQTT connection error:", error);
  });

  mqttClient.on("close", () => {
    console.log("🟡 MQTT connection closed");
  });

  mqttClient.on("reconnect", () => {
    console.log("🔄 MQTT reconnecting...");
  });

  return mqttClient;
}

function getMQTTClient() {
  return mqttClient;
}

function closeMQTT() {
  if (mqttClient) {
    mqttClient.end();
    console.log("👋 MQTT client disconnected");
  }
}

module.exports = {
  setupMQTT,
  getMQTTClient,
  closeMQTT,
};
