import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import styled from 'styled-components';

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
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
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
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }
`;

const ScannerContainer = styled.div`
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const [data, setData] = useState("ยังไม่พบข้อมูล");

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
    setTimeout(() => setPause(false), 2000);
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
      </Card>
    </Container>
  );
}