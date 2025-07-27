import React, { useState, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [data, setData] = useState("");

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
    } catch (err) {
      console.error("Camera permission denied:", err);
      alert("Camera permission is required to scan QR codes.");
    }
  };

  // To prevent repeated scans of the same QR code
  const handleResult = useCallback((text, result) => {
    if (text && text !== data) {
      console.log("Scanned:", text);
      setData(text);

      // Optional: Reset after 3 seconds to allow re-scanning
      setTimeout(() => {
        setData("");
      }, 3000);
    }
  }, [data]);

  // ...existing code...
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>QR Code Scanner 3</h1>


      <button onClick={requestCamera} style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
        Request Camera Access
      </button>
      <div style={{ maxWidth: "500px", margin: "1rem auto" }}>
        <Scanner onScan={(result) => handleResult(result)} />;
        {}
        <button
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          onClick={() => handleResult("TEST_QR_DATA", null)}
        >
          Simulate Scan
        </button>
      </div>


      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        <strong>Scanned Data:</strong> {data || "Waiting..."}
      </p>
    </div>
  );
}

export default App;
