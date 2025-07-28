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
            settoken({Role: e.target.value})
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
          "7fd04eb45c1a968a806aa582d08d6c696212fe207dbb5d9d61f477d150397dba127b221e02058586c4ecbaf53a9a90921eb124d87195f066bcfedc05466a0cbd011ec3da2fe9e3b413c978af156f86ab9b85b7059b13e50f53aef0e2be0f1c21cbc1b436d44fa5f3cec3dab201256a4155a6e848ec4b46394b8aaab27b8998802bc1142d421f7e4fac57d2ce83d0565951e58b489530b488bec01f18370771c380dc1421e16ad40f278c18aa758e590c23db65fff1636e525686d9108e03f3a5477d63736fd675272d97044c237935717e1d8aaa2b4f3cf29610ce1805e6eef8d1d15a333a31d50e08a58e31617ec10d7e7bc9b5816fcb992422b7532e853945fecc70c8139eda617802532e988fe70626bdd9af15460e8b27e787d33957317f3e4c4854949b9f29d17f59f4d4d087114097ece138130acc11ed9e7d99ba53298505dee6e5b01f41a6ebbfe19e23ea8ef274ad826b3670fde1ea13719399a613a857d7a2a1c3ee6aa5e624bb377461e9321df711e225eb70d2f3eade72e9b42906a939d88f41ade9622f"
        )}></button>
      </Card>
    </Container>
  );
}