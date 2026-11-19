// Opening schedule in Luxembourg local time. Keep in sync with HOURS in data.js.
const SCHEDULE = {
  0: [['18:00', '22:30']],
  1: [],
  2: [['18:00', '23:30']],
  3: [['18:00', '23:30']],
  4: [['18:00', '23:30']],
  5: [['18:00', '23:30']],
  6: [['12:00', '15:00'], ['18:00', '24:00']]
};
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const toMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

function luxembourgNow(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Luxembourg',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return { day: DAYS.indexOf(get('weekday')), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function getServiceStatus(date = new Date()) {
  const { day, minutes } = luxembourgNow(date);
  for (const [from, to] of SCHEDULE[day]) {
    if (minutes >= toMin(from) && minutes < toMin(to)) {
      return { open: true, label: `Open now until ${to === '24:00' ? '00:00' : to}` };
    }
  }
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    for (const [from] of SCHEDULE[d]) {
      if (i > 0 || toMin(from) > minutes) {
        const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d];
        return { open: false, label: `Closed now, opens ${when} at ${from}` };
      }
    }
  }
  return { open: false, label: 'Closed' };
}
