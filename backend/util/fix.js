const fs = require('fs');
const readline = require('readline');
const { strip } = require('./util');

const readParkingData = new Promise((res) => {
  const fileStream = fs.createReadStream('./parking.json');

  const rl = readline.createInterface({
    input: fileStream,
  });
  const parkingData = [];
  const stallData = [];
  const ids = new Set();
  rl.on('close', () => {
    res({ parkingData, stallData });
  });
  rl.on('line', (line) => {
    // Handle some weirdness with the way this was scraped...
    if (!line.startsWith('{')) return;
    if (line.endsWith(',')) line = line.slice(0, line.length - 1);
    line = JSON.parse(line);

    const { data } = line;
    // Fix data
    data.forEach((i) => {
      parkingData.push(strip(i));

      if (!ids.has(i.stallID)) {
        const { status: _, payloadTimestamp: __, ...toPush } = i;
        stallData.push(toPush);
        ids.add(i.stallID);
      }
    });
  });
});

readParkingData.then((i) => {
  fs.writeFileSync('./parking-fixed.json', JSON.stringify(i));
  console.log(i);
});
