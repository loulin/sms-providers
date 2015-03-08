# sms-providers
SMS providers for [`smsex`](https://github.com/loulin/smsex). More providers are in progress.

## Installation

```
$ npm install sms-providers
```

## Examples

```js
var smsex = require('smsex');
var providers = require('sms-providers');

var ap = new providers.AProvides('account', 'password');
ap.templates = {
  'register': 1
};

smsex.use('a', ap);
smsex.send({
  to: '13800000000',
  body: {
    code: '850119'
  },
  provider: 'a',
  template: 'register'
}, function (err, res) {});
```

## License

  MIT
