import { useState } from "react";
import axios from "axios";

function App() {
  const [temperature, setTemperature] = useState("");
  const [vibration, setVibration] = useState("");
  const [response, setResponse] = useState(null);

  const sendData = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/data`,
        {
          deviceId: "ESP32-001",
          temperature: parseFloat(temperature),
          vibration: parseFloat(vibration),
        }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to send data. Check backend connection.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI" }}>
      <h1>⚙️ Predictive Maintenance Dashboard</h1>

      <div style={{ margin: "1rem 0" }}>
        <label>🌡 Temperature (°C): </label>
        <input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
      </div>

      <div style={{ margin: "1rem 0" }}>
        <label>🌀 Vibration (g): </label>
        <input
          type="number"
          value={vibration}
          onChange={(e) => setVibration(e.target.value)}
        />
      </div>

      <button onClick={sendData}>🚀 Send Data</button>

      {response && (
        <div style={{ marginTop: "2rem" }}>
          <h3>✅ Response from Backend:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
