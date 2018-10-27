import qs from 'query-string';
import storage from './storage';

/* eslint no-underscore-dangle: 0 */

const query = qs.parse(window.location.search);
const debug = query.__debug;
if (debug !== undefined) {
  storage.set('__debug', debug === 'true');
}

export default !!storage.get('__debug');
