import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Chart = ({ fromData, toData, fromTime, toTime }) => {
  if (!fromData || !toData) {
    return <p>Loading data...</p>;
  }

  const mergedData = fromData.hourly_predictions.map((fromHour, index) => ({
    hour: fromHour.hour,
    fromProbability: fromHour.probability,
    toProbability: toData.hourly_predictions[index]?.probability || 0,
  }));

  return (
    <LineChart
      width={800}
      height={400}
      data={mergedData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="hour"
        label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
      />
      <YAxis
        label={{ value: 'Probability', angle: -90, position: 'insideLeft' }}
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="fromProbability"
        stroke="#8884d8"
        name={`From ${fromData.block_id}`}
      />
      <Line
        type="monotone"
        dataKey="toProbability"
        stroke="#82ca9d"
        name={`To ${toData.block_id}`}
      />
    </LineChart>
  );
};

export default Chart;
