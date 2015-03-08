import request from 'superagent';
import { parseString } from 'xml2js';

const apiUrl = 'http://106.ihuyi.cn/webservice/sms.php?method=Submit';

class HuYi {
  constructor(account, password) {
    this.account = account;
    this.password = password;
    this.name = 'huyi';
  }

  send(options, cb) {
    var data = {
      account: this.account,
      password: this.password,
      mobile: options.to,
      content: options.content
    };
    return request.post(apiUrl).type('form').send(data).end(res => {
      if (res.error) {
        let error = new Error(`Request ${apiUrl} error`);
        error.status = res.status;
        return cb(error);
      }

      parseString(res.text, {
        explicitRoot: false,
        explicitArray: false
      }, (err, result) => {
        if (err) {
          return cb(err);
        }

        if (result.code !== '2') {
          let error = new Error(result.msg);
          error.status = parseInt(result.code, 10);
          error.raw = res.text;
          return cb(error);
        }

        return cb(null, res.text);
      });
    });
  }
}

export default HuYi;