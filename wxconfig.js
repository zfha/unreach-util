import scriptjs from 'scriptjs';
import qs from 'query-string';
import { request } from './request';

const debug = require('debug')('util/wxconfig');


const WX_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.3.0.js';


let defer = null;
export default function() {
  defer = defer || wxconfig();
  return defer;
}


async function wxconfig() {
  await loadSdk();
  const info = await loadJsSign();
  if (!info) {
    window.console.error('load signature error');
    return;
  }

  debug('try config wx', info);
  window.wx.config({
    appId: info.appId,
    timestamp: info.timestamp,
    nonceStr: info.nonceStr,
    signature: info.signature,
    jsApiList: [
      // 分享到朋友圈
      'onMenuShareTimeline',
      // 分享给好友
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareQZone',
      'onMenuShareWeibo',
      //小程序
      'miniProgram',
      'openEnterpriseChat',
      'openEnterpriseContact',
      //音频相关
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice',
      //图片相关
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'translateVoice',
      'getNetworkType',
      //网络
      'openLocation',
      //位置
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'closeWindow',
      'scanQRCode'
    ]
  });
}


function loadSdk() {
  return new Promise(resolve => scriptjs(WX_SDK_URL, resolve));
}


async function loadJsSign() {
  const data = { bizType: 'tech', url: window.location.href };
  const url = 'weixin/jsSignature?' + qs.stringify(data);
  const res = await request({ scope: 'member', method: 'POST', url, env: 'production' });
  return res && res.data;
}
