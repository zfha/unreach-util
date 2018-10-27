import qs from 'query-string';
import { request as requestAPI } from './request';


async function request(method, path, data) {
  const res = await requestAPI({
    method: 'POST',
    scope: 'bmatch',
    url: 'pivot/gitee/request',
    data: {
      method,
      path,
      data
    }
  });
  return res.data;
}


async function get(path, data) {
  data = { _: Date.now(), ...data };
  path = path + '?' + qs.stringify(data);
  const o = await request('GET', path, {});
  if (o && o.message && (/404/).test(o.message)) {
    return null;
  }
  return o;
}


function post(path, data) {
  return request('POST', path, data);
}


export { request, get, post };
