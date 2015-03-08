import request from 'superagent';

const apiUrl = 'http://sms.1xinxi.cn/asmx/smsservice.aspx';

class TheFirst {
  constructor(account, password) {
    this.account = account;
    this.password = password;
    this.name = 'thefirst';
  }

  send(options, cb) {
    let data = {
      name: this.account,
      pwd: this.password,
      mobile: options.to,
      content: options.content,
      type: 'pt'
    };
    request.post(apiUrl).type('form').send(data).end(res => {
      if (res.error) {
        let error = new Error(`Request ${apiUrl} error`);
        error.status = res.status;
        return cb(error);
      }

      let result = res.text.split(',');
      if (result[0] !== '0') {
        let error = new Error(result[1]);
        error.status = parseInt(result[0], 10);
        error.raw = res.text;
        return cb(error);
      }

      return cb(null, res.text);
    });
  }
}

export default TheFirst;