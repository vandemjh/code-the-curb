const getDateInfo = (o) => {
  const date = new Date(o.payloadTimestamp);
  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
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
  const di = getDateInfo(o);
  const status = getStatus(o);
  return {
    id: o.blockfaceID,
    s: status,
    h: di.hours,
    m: di.minutes,
    d: di.dayOfWeek,
  };
};

module.exports = {
  getDateInfo,
  getStatus,
  strip,
};
