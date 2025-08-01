import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import styled from 'styled-components';
import axios from "axios";
import './App.css'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s ease; /* Removed transform */

  /* Optional: Set a min/max height if needed for uniform cards */
  /* min-height: 300px; */

  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15); /* No movement */
  }

  pre {
    max-height: 300px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;


const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: #4361ee;
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const Controls = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  select {
    padding: 0.8rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      outline: none;
      border-color: #4cc9f0;
      box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.2);
    }
  }
`;

const ResultDisplay = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;

  h2 {
    color: #4361ee;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  pre {
    background-color: black;
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 300px; /* Prevent it from growing indefinitely */
    white-space: pre-wrap; /* Keeps line breaks and wraps long lines */
    word-break: break-word; /* Breaks long words instead of expanding container */
  }
`;

const ScannerContainer = styled.div`
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

interface Role {
  Role: string
}

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const [data, setData] = useState("");
  const [token, settoken] = useState<Role | undefined>({ Role: "admin" })
  const [result, setResult] = useState("");

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = async (data: string) => {
    setPause(true);
    setData(data);
    try {
      const result1 = await axios.post("https://qr-backend-iszs.onrender.com/decrypt",
        { encrypted: data },
        {
          headers: {
            Authorization: `${token?.Role}`
          }
        }
      )
      console.log(result1)
      console.log(result1.data.data.Firstname)
      setResult(JSON.stringify(result1.data.data))

    } catch (error: any) {

    }
    setPause(false)

  };

  const handleReset =() =>{
    setData("")
    setResult("")
  }

  return (
    <Container>
      <Card>
        <Header>
          <h1>ระบบสแกน QR Code</h1>
          <p>กรุณาเลือกอุปกรณ์กล้องและสแกน QR Code</p>
        </Header>

        <Controls>
          <select onChange={(e) => setDeviceId(e.target.value)}>
            <option value={undefined}>เลือกอุปกรณ์กล้อง</option>
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label || `กล้อง ${index + 1}`}
              </option>
            ))}
          </select>

          <select onChange={(e) => setTracker(e.target.value)}>
            <option value="centerText">รูปแบบการตรวจจับ</option>
            <option value="centerText">ข้อความกลาง</option>
            <option value="outline">เส้นขอบ</option>
            <option value="boundingBox">กรอบสี่เหลี่ยม</option>
            <option value={undefined}>ไม่แสดงตัวช่วย</option>
          </select>

          <select onChange={(e) =>
            settoken({ Role: e.target.value })
          }>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </Controls>

        <ScannerContainer>
          <Scanner
            formats={["qr_code"]}
            constraints={{ deviceId }}
            onScan={(detectedCodes) => {
              if (detectedCodes.length > 0) {
                handleScan(detectedCodes[0].rawValue);
              }
            }}
            onError={(error) => {
              console.error(`เกิดข้อผิดพลาด: ${error}`);
            }}
            styles={{
              container: {
                height: "400px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden"
              }
            }}
            components={{
              onOff: true,
              torch: true,
              zoom: true,
              finder: true,
              tracker: getTracker(),
            }}
            allowMultiple={false}
            scanDelay={2000}
            paused={pause}
          />
        </ScannerContainer>

        <ResultDisplay>
          <h2>ผลลัพธ์การสแกน</h2>
          <pre>{data}</pre>
        </ResultDisplay>
        <ResultDisplay>
          <h2>ผลลัพธ์การสแกนหลังถอดรหัส</h2>
          <pre>{result}</pre>
        </ResultDisplay>
        <button onClick={() => handleScan(
          "5zIx5KVXBbf8VHjvvKHWIh6+YeO/p6tfqcjIkxG4q/T/Lr/SArdbQXJI+XzMRzoX1OrHNvJVhaLNkSGhfPp7HrrCQR7Sk7NGYkcCuQ=="
        )}>ปุ่ม TEST Mockdata</button>
        <button onClick={() => handleReset()}> Reset</button>

        <ResultDisplay>
          <h2> KEY1 = 1234567891234567</h2>
          <h2> KEY2 = 1234567891234569</h2>
          <h2> iv = s6504062636039za</h2>
        </ResultDisplay>
      </Card>
    </Container>
  );
}