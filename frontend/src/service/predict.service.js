export const getClosestBlockfaceId = (data, lat, long) => {
  const euclideanDistance = (lat1, lon1, lat2, lon2) => {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    return Math.sqrt(dLat ** 2 + dLon ** 2);
  };

  let closest = null;
  let minDistance = Infinity;

  data.forEach((stall) => {
    const { lat: stallLat, long: stallLong } = stall.location;
    const distance = euclideanDistance(lat, long, stallLat, stallLong);
    if (distance < minDistance) {
      minDistance = distance;
      closest = stall.blockfaceID;
    }
  });

  return closest;
};

const CACHE_KEY = 'apiDataCache';
const CACHE_TIMESTAMP_KEY = 'cacheTimestamp';
const CACHE_DURATION = 5 * 60 * 1000;

export const getApiData = () => {
  return new Promise((res, rej) => {
    const now = Date.now();

    const cachedData = sessionStorage.getItem(CACHE_KEY);
    const cachedTimestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (
      cachedData &&
      cachedTimestamp &&
      now - parseInt(cachedTimestamp, 10) < CACHE_DURATION
    ) {
      console.log('Returning cached data from sessionStorage');
      return res(JSON.parse(cachedData));
    }

    fetch('https://api.exactpark.com/api/v2/arlington/status/zones')
      .then((response) => response.json())
      .then((json) => {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
        sessionStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        res(json.data);
      })
      .catch((error) => {
        console.error(error);
        rej(error);
      });
  });
};

export const predict = (data) => {
  const backend = process.env.REACT_APP_BACKEND_URL || ''
  return new Promise((res, rej) => {
    fetch(`${backend}/predict`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        res(json);
      })
      .catch((error) => {
        console.error(error);
        rej(error);
      });
  });
};
