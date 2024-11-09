const fs = require('fs');
const readline = require('readline');
const { strip } = require('./util');

const readParkingData = new Promise((res) => {
  const fileStream = fs.createReadStream('./parking.json');

  const rl = readline.createInterface({
    input: fileStream,
  });
  const parkingData = [];
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
      parkingData.push(strip(i))
    });
  });
});

readParkingData.then((i) => {
  fs.writeFileSync(
    './parking-fixed.json',
    JSON.stringify(i.parkingData, undefined, 2),
  );
  console.log(`Wrote ${i.parkingData.length} entries`);
});
