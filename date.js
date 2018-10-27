export function parse(str) {
  if (!str) {
    throw new Error('invalid date, receive null');
  }
  if (typeof str === 'number') {
    return new Date(str);
  }

  if (isDate(str)) {
    return str;
  }

  const date = new Date(str);
  if (date.getTime()) {
    return date;
  }
  return parseDate(str);
}


/**
 * @see http://momentjs.com/docs/#/displaying/format/
 */
export function format(date, patern = 'YYYY-MM-DD') {
  date = parse(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const map = {
    YY: ('' + year).substr(-2),
    YYYY: '' + year,
    M: '' + month,
    MM: ('0' + month).substr(-2),
    D: '' + day,
    DD: ('0' + day).substr(-2),
    H: '' + hour,
    HH: ('0' + hour).substr(-2),
    h: '' + (hour % 12),
    hh: ('0' + (hour % 12)).substr(-2),
    m: '' + minute,
    mm: ('' + minute).substr(-2),
    s: '' + second,
    ss: ('0' + second).substr(-2)
  };
  return patern.replace(/([a-zA-Z]+)/g, (_, p) => map[p] || p);
}


const ONE_DAY = 3600 * 24 * 1000;
export function friendly(date) {
  date = parse(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const diff = today.getTime() - date.getTime();
  const diffDays = Math.floor(diff / ONE_DAY);
  const diffYears = today.getFullYear() - date.getFullYear();
  const labels = ['今天', '昨天', '前天'];
  const pattern = labels[diffDays] ||
        (diffYears === 0 ? 'M月D日' : 'YYYY年M月D日');
  return format(date, `${pattern} H:m`);
}


export default { parse, format, friendly };


const toString = Object.prototype.toString;
function isDate(d) {
  return d && toString.call(d) === '[object Date]';
}


/**
 * @see https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
 */
// YYYY-MM-DDTHH:mm:ss.sssZ
const re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})([-+]\d{4})$/;
const invalid = new Date('invalid');
function parseDate(str) {
  const match = re.exec(str);
  if (!match) {
    return invalid;
  }
  const m = match.slice(1, 8).map(v => parseInt(v, 10));
  const d = new Date(Date.UTC(m[0], m[1] - 1, m[2], m[3], m[4], m[5]));
  const z = parseInt(match[8], 10);
  // exp +0800 -> should minus 8 hours
  const diff = z / 100 * 3600 * 1000;  // to milliseconds
  const time = d.getTime() - diff;
  return new Date(time);
}


const $test = { parseDate };
export { $test };
