import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [temperature, setTemperature] = useState("");
  const [vibration, setVibration] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);

  // Send data to backend
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

      // Add to local chart history
      const newEntry = {
        timestamp: new Date().toLocaleTimeString(),
        temperature: parseFloat(temperature),
        vibration: parseFloat(vibration),
      };
      setHistory((prev) => [...prev.slice(-9), newEntry]);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to send data. Check backend connection.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Predictive Maintenance Dashboard</h1>

      <div style={styles.cardContainer}>
        {/* Input Card */}
        <div style={styles.card}>
          <h2>📡 Input Sensor Data</h2>

          <div style={styles.inputGroup}>
            <label>🌡 Temperature (°C):</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>🌀 Vibration (g):</label>
            <input
              type="number"
              value={vibration}
              onChange={(e) => setVibration(e.target.value)}
              style={styles.input}
            />
          </div>

          <button onClick={sendData} style={styles.button}>
            🚀 Send Data
          </button>
        </div>

        {/* Prediction Card */}
        <div style={styles.card}>
          <h2>🧠 AI Prediction</h2>
          {response ? (
            <div>
              <p>✅ <b>{response.message}</b></p>
              <h3>🕒 Predicted Remaining Life:</h3>
              <h2 style={{ color: "#61dafb" }}>
                {response.predicted_remaining_life.toFixed(2)} hours
              </h2>
            </div>
          ) : (
            <p>Awaiting input...</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartContainer}>
        <div style={styles.chartCard}>
          <h3>🌡 Temperature Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3>🌀 Vibration Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vibration" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// 🎨 Simple inline styling
const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#1e1e1e",
    color: "white",
    fontFamily: "Segoe UI",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "2rem",
  },
  cardContainer: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#2a2a2a",
    padding: "1.5rem",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  inputGroup: {
    margin: "1rem 0",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "white",
  },
  button: {
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    backgroundColor: "#61dafb",
    border: "none",
    cursor: "pointer",
    color: "black",
    fontWeight: "bold",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginTop: "2rem",
    flexWrap: "wrap",
  },
  chartCard: {
    backgroundColor: "#2a2a2a",
    padding: "1.5rem",
    borderRadius: "12px",
    width: "480px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
};

export default App;
