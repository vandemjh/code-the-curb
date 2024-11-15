import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

const convertTo24Hour = (timeString) => {
  const [time, modifier] = timeString.split(' ');
  let [hours] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours;
};

const Chart = ({ fromData, toData, fromTime, toTime }) => {
  if (!fromData || !toData) {
    return <p>Loading data...</p>;
  }

  const mergedData = fromData.hourly_predictions.map((fromHour, index) => ({
    hour: fromHour.hour,
    fromProbability: fromHour.probability,
    toProbability: toData.hourly_predictions[index]?.probability || 0,
  }));

  const fromTimeData = mergedData.find(
    (d) => d.hour === convertTo24Hour(fromTime),
  );
  const toTimeData = mergedData.find((d) => d.hour === convertTo24Hour(toTime));

  return (
    <div>
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
        {fromTimeData?.hour !== undefined && (
          <ReferenceLine
            x={fromTimeData.hour}
            stroke="red"
            strokeDasharray="3 3"
            label={{ value: `From`, position: 'top' }}
          />
        )}
        {toTimeData?.hour !== undefined && (
          <ReferenceLine
            x={toTimeData.hour}
            stroke="blue"
            strokeDasharray="3 3"
            label={{ value: `To`, position: 'top' }}
          />
        )}
      </LineChart>

      <div style={{ marginTop: '20px', fontSize: '16px' }}>
        {fromTimeData && (
          <p>
            Probability at {fromTime}:<br></br>
            <strong>{fromTimeData.fromProbability.toFixed(3)}</strong>
          </p>
        )}
        {toTimeData && (
          <p>
            Probability at {toTime}:<br></br>
            <strong>{toTimeData.toProbability.toFixed(3)}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Chart;
