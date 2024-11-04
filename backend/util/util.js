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

const getStatus = (o) => (o.status === 'vacant' ? 1 : 0);

const strip = (o) => {
  const di = getDateInfo(o);
  const status = getStatus(o);
  return { id: o.stallID, s: status, h: di.hours, m: di.minutes, d: di.dayOfWeek };
};

module.exports = {
  getDateInfo,
  getStatus,
  strip,
};
