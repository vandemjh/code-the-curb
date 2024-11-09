const getDateInfo = (o) => {
  const date = new Date(o.payloadTimestamp);
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return {
    dayOfWeek,
    hours,
    minutes,
  };
};

const getStatus = (o) => (o.status === 'vacant' ? 0 : 1);

const strip = (o) => {
  const { dayOfWeek, hours, minutes } = getDateInfo(o);
  const status = getStatus(o);
  const id = o.blockfaceID;
  return {
    id,
    status,
    hours,
    minutes,
    dayOfWeek,
  };
};

module.exports = {
  getDateInfo,
  getStatus,
  strip,
};
