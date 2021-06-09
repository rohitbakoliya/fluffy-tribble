const axios = require('axios');
const moment = require('moment');
const { API_BASE_URL, BASE_REQ_HEADERS } = require('./config');
const { makeCall } = require('./makeCall');

const pincode = process.env.PINCODE;

let lastCallLog = null;

const getSlotsForDate = async date => {
  let req = {
    method: 'get',
    url: `${API_BASE_URL}/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`,
    headers: BASE_REQ_HEADERS,
  };

  const response = await axios(req);
  let sessions = response.data.sessions;
  sessions = sessions.filter(
    session => session.min_age_limit === 18 && session.available_capacity > 0
  );
  console.log('call log: ' + lastCallLog);
  if (sessions.length > 0) {
    console.log(`
    -------------------------------------------
                  ****************
                   slot available
                  ****************
    -------------------------------------------
    `);
    if (lastCallLog != null) {
      const l = moment(lastCallLog);
      const r = moment(Date.now());
      if (r.diff(l, 'minute', true) >= 5) {
        notifyMe();
        lastCallLog = Date.now();
      }
    } else {
      notifyMe();
      lastCallLog = Date.now();
    }
  } else {
    console.log('no slot available');
  }
};

const notifyMe = () => {
  makeCall();
};

const fetchNext3Days = () => {
  let dates = [];
  let today = moment();
  for (let i = 0; i < 3; i++) {
    let dateString = today.format('DD-MM-YYYY');
    dates.push(dateString);
    today.add(1, 'day');
  }
  return dates;
};

exports.checkAvailability = async () => {
  let datesArray = fetchNext3Days();
  datesArray.forEach(date => {
    getSlotsForDate(date);
  });
};
