import React, { useEffect, useState } from 'react';
const Chart = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('https://api.example.com/chart')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div>
      <h1>Chart</h1>
      {/* <LineChart data={data} /> */}
    </div>
  );
}
export default Chart;
