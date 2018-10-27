import wxconfig from './wxconfig';

export default async function share({ title, desc, link, image }) {
  await wxconfig();

  const wx = window.wx;
  const opts = {
    title,
    desc,
    link,
    imgUrl: image,
    type: 'link',
    dataUrl: '',
    trigger: logger('share trigger'),
    success: logger('share success'),
    cancel: logger('share cancel')
  };

  wx.ready(() => {
    // 分享到朋友圈
    wx.onMenuShareTimeline(opts);
    // 分享给好友
    wx.onMenuShareAppMessage(opts);
    // 分享到QQ
    wx.onMenuShareQQ(opts);
    // 分享到QQ空间
    wx.onMenuShareQZone(opts);
  });
}

function logger(msg) {
  return (...args) => {
    window.console.log(msg, ...args);
  };
}
