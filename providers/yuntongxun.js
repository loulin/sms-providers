import request from 'superagent';
import crypto from 'crypto';
import moment from 'moment';
import _ from 'lodash';

const SANDBOX_URL = 'https://sandboxapp.cloopen.com:8883';
const APP_URL = 'https://app.cloopen.com:8883';

class YunTongXun {
  constructor(accountSid, authToken, appId, isProduction) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.appId = appId;
    this.baseUrl = isProduction ? APP_URL : SANDBOX_URL;
    this.name = 'yuntongxun';
  }

  send(options, cb) {
    let baseUrl = this.baseUrl;
    if (options.env) {
      baseUrl = options.env === 'production' ? APP_URL : SANDBOX_URL;
    }

    let timestamp = moment().format('YYYYMMDDHHmmss');

    let sig = crypto.createHash('md5').update(this.accountSid + this.authToken + timestamp).digest('hex');
    let authorization = new Buffer(`${this.accountSid}:${timestamp}`).toString('base64');
    let apiUrl = `${baseUrl}/2013-12-26/Accounts/${this.accountSid}/SMS/TemplateSMS?sig=${sig}`;

    // BUG: if body is object, the datas order is not guaranteed
    let datas = _.isObject(options.body) ? _.values(options.body) : options.body;
    let content = {
      "to": options.to,
      "appId": this.appId,
      "templateId": options.template,
      "datas": datas // datas should be array
    };

    return request.post(apiUrl).type('json').accept('json').set('Authorization', authorization).send(content).end(res => {
      if (res.error) {
        let error = new Error(`Request ${apiUrl} error`);
        error.status = res.status;
        return cb(error);
      }

      let result = res.body;
      if (result.statusCode === '000000') {
        return cb(null, result);
      } else {
        let error = new Error(result.statusMsg);
        error.status = parseInt(result.statusCode || 500, 10);
        error.raw = res.text;
        return cb(error);
      }
    });
  }
}

export default YunTongXun;