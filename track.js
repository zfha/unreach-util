import qs from 'querystring';
import { request } from './request';
import env from './env';

const debug = require('debug')('track');

const getLoginUserId = cached(async() => {
  // 打点取用户id不管环境，直接取线上的
  const { data } = await request({
    scope: 'member',
    url: '/account/query',
    env: 'production'
  });
  return data && data.user && data.user.id;
});

export default async function track({ type, id, data }) {
  debug('track: [%s] %s', type, id);
  const url = await getTrackUrl({ type, id, data, ext: '.gif' });
  const img = new Image();
  img.src = url;
}

export async function trackSync({ type, id, data }) {
  debug('track sync: [%s] %s', type, id);
  const url = await getTrackUrl({ type, id, data });
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
  xhr.send();
}

async function getTrackUrl({ type, id, data, ext = '' }) {
  type = type || 'click';
  const userId = await getLoginUserId();
  if (env === 'development') {
    type = 'test_' + type;
  }

  const url = window.location.href.replace(/#.*$/, ''); // remove hash
  const query = {
    APIVersion: '0.6.0', // 保留字段，必选
    url,
    __topic__: userId || '',
    __userAgent__: window.navigator.userAgent,
    type,
    id: id || '',
    data: JSON.stringify(data || {}),
    _t: Date.now()
  };

  const trackUrl =
    'https://learninqgt.cn-hangzhou.log.aliyuncs.com/logstores/document/track';
  return `${trackUrl}${ext}?${qs.stringify(query)}`;
}

function cached(fn) {
  let called = false;
  let result = null;
  return async function() {
    if (called) {
      return result;
    }
    called = true;
    result = await fn.apply(this, arguments);
    return result;
  };
}
