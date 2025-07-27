import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

const App = () => {

    const [data , setdata]  = useState("nodata")

    const handledata =(result ) =>{
      setdata(result)
      console.log(result)
    }

    return (
    <div>
      <h1>QR CODE</h1>
      <Scanner onScan={(result) => handledata(result)} />
      <h2>RESULT : {data}</h2>
    </div> )
};

export default App;
