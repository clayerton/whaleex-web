const fetch = require('node-fetch');
const token =
  '2c5e2a5e22a33248d54ce3200013ca09e215e2ce2ea2aa1ba7b263d5a6c1dc83';
const url =
  'https://gw.wmcloud-stg.com/usermaster/card/lib/admin/global/cards.json';
const data = {
  product: 'rrp',
  key: 'ANNOUNCEMENT_EVENT',
  name: '公告事件',
  description: '',
  tags: ['info'],
};
fetch(url, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then(console.log);
