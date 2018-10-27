import qs from 'query-string';
import storage from './storage';


// try get from url for debug
const query = qs.parse(window.location.search);
const qsenv = query['debug.env'];
if (qsenv !== undefined) {
  if (qsenv) {
    storage.set('debug.env', qsenv);
  } else {
    storage.remove('debug.env');
  }
}


const env = storage.get('debug.env') ||
      process.env.REACT_APP_ENV ||
      process.env.NODE_ENV || 'development';


console.log(`LOG: env is ${env}`);   // eslint-disable-line

export default env;
