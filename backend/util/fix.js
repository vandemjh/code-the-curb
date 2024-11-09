const fs = require('fs');
const readline = require('readline');
const { strip } = require('./util');

const readParkingData = new Promise((res) => {
  const fileStream = fs.createReadStream('./parking.json');

  const rl = readline.createInterface({
    input: fileStream,
  });
  const parkingData = {};
  rl.on('close', () => {
    res({ parkingData });
  });
  rl.on('line', (line) => {
    // Handle some weirdness with the way this was scraped...
    if (!line.startsWith('{')) return;
    if (line.endsWith(',')) line = line.slice(0, line.length - 1);
    line = JSON.parse(line);

    const { data } = line;
    // Fix data
    data.forEach((i) => {
      const o = strip(i);
      const { id, status, hours, dayOfWeek } = o;
      const key = `${id}_${dayOfWeek}_${hours}`;
      if (!parkingData[key]) {
        parkingData[key] = { totalOccupied: 0, count: 0 };
      }
      parkingData[key].totalOccupied += status;
      parkingData[key].count += 1;
    });
  });
});

readParkingData.then((i) => {
  const { parkingData } = i;
  const toWrite = {};
  Object.keys(parkingData).forEach((key) => {
    const [id, dayOfWeek, hours] = key.split('_');
    const average = parkingData[key].totalOccupied / parkingData[key].count;
    if (!toWrite[id]) toWrite[id] = {};
    if (!toWrite[id][dayOfWeek]) toWrite[id][dayOfWeek] = {};
    toWrite[id][dayOfWeek][hours] = average
  });
  fs.writeFileSync(
    './parking-fixed.json',
    JSON.stringify(toWrite, undefined, 2),
  );
  console.log(`Wrote ${Object.keys(toWrite).length} entries`);
  // fs.writeFileSync('./stalls.json', JSON.stringify(i.stallData));
  // console.log(`Wrote ${i.stallData.length} stalls`);
});
