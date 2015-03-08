"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
云通讯 http://docs.yuntongxun.com/index.php/%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97:%E7%9F%AD%E4%BF%A1%E9%AA%8C%E8%AF%81%E7%A0%81/%E9%80%9A%E7%9F%A5
*/

var request = _interopRequire(require("superagent"));

var crypto = _interopRequire(require("crypto"));

var moment = _interopRequire(require("moment"));

var _ = _interopRequire(require("lodash"));

var YunTongXun = (function () {
  function YunTongXun(accountSid, authToken, appId, isProduction) {
    _classCallCheck(this, YunTongXun);

    this.accountSid = accountSid;
    this.authToken = authToken;
    this.appId = appId;
    this.baseUrl = isProduction ? "https://app.cloopen.com:8883" : "https://sandboxapp.cloopen.com:8883";
    this.name = "yuntongxun";
  }

  _createClass(YunTongXun, {
    send: {
      value: function send(options, cb) {
        var timestamp = moment().format("YYYYMMDDHHmmss");

        var sig = crypto.createHash("md5").update(this.accountSid + this.authToken + timestamp).digest("hex");
        var authorization = new Buffer("" + this.accountSid + ":" + timestamp).toString("base64");
        var apiUrl = "" + this.baseUrl + "/2013-12-26/Accounts/" + this.accountSid + "/SMS/TemplateSMS?sig=" + sig;

        var datas = _.isObject(options.body) ? _.values(options.body) : options.body;
        var content = {
          to: options.to,
          appId: this.appId,
          templateId: options.template,
          datas: datas // datas should be array
        };

        return request.post(apiUrl).type("json").accept("json").set("Authorization", authorization).send(content).end(function (res) {
          if (res.error) {
            var error = new Error("Request " + apiUrl + " error");
            error.status = res.status;
            return cb(error);
          }

          var result = res.body;
          if (result.statusCode === "000000") {
            return cb(null, result);
          } else {
            var error = new Error(result.statusMsg);
            error.status = parseInt(result.statusCode || 500, 10);
            error.raw = res.text;
            return cb(error);
          }
        });
      }
    }
  });

  return YunTongXun;
})();

module.exports = YunTongXun;
//# sourceMappingURL=yuntongxun.js.map