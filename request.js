import axios from 'axios';
import genv from './env';

const serverHost = /(\.[-\w]+\.[-\w]+)$/.exec(window.location.hostname)[1];

export async function request({
  method = 'get',
  scope,
  url,
  params,
  data,
  env
}) {
  if (!url.startsWith('http')) {
    url = `${getHost(scope, { env })}/api/${url}`;
  }
  if (method === 'get') {
    params = { ...params, ...data, _: Date.now() };
  }
  const res = await axios({
    method,
    url,
    params,
    data,
    withCredentials: true
  });
  return res.data;
}

export async function get(scope, url, params, opts) {
  const res = await request({ scope, url, params, method: 'get', ...opts });
  return res.isSuccess && res.data;
}

export async function post(scope, url, data, opts) {
  const res = await request({ scope, url, data, method: 'post', ...opts });
  return res.isSuccess;
}

export function postSync(scope, url, data) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', `${getHost(scope)}/api/${url}`, false);
  xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xmlhttp.send(JSON.stringify(data));
}

function getHost(scope, opts = {}) {
  const env = opts.env || genv;
  return env === 'development' ?
    `https://${scope}.dev${serverHost}` :
    `https://${scope}${serverHost}`;
}

export default { request, get, post, postSync };
