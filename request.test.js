jest.mock('axios', () => {
  return jest.fn(() => ({ isSuccess: true, data: 'ok' }));
});

const axios = require('axios');
const { request } = require('./request');


describe('request', () => {
  it('custom env', async() => {
    const accountIds = [1, 2, 3, 4];
    const result = await request({
      method: 'post',
      scope: 'member',
      url: 'account/batch/query',
      data: {
        accountIds
      },
      env: 'development'
    });

    const opts = axios.mock.calls[0][0];
    expect(opts.url).toBe('https://member.dev.unreach.io/api/account/batch/query');
    expect(result).toBe('ok');
    axios.mockRestore();
  });
});
