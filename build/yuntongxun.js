"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var request = _interopRequire(require("superagent"));

var crypto = _interopRequire(require("crypto"));

var moment = _interopRequire(require("moment"));

var _ = _interopRequire(require("lodash"));

var SANDBOX_URL = "https://sandboxapp.cloopen.com:8883";
var APP_URL = "https://app.cloopen.com:8883";

var YunTongXun = (function () {
  function YunTongXun(accountSid, authToken, appId, isProduction) {
    _classCallCheck(this, YunTongXun);

    this.accountSid = accountSid;
    this.authToken = authToken;
    this.appId = appId;
    this.baseUrl = isProduction ? APP_URL : SANDBOX_URL;
    this.name = "yuntongxun";
  }

  _createClass(YunTongXun, {
    send: {
      value: function send(options, cb) {
        var baseUrl = this.baseUrl;
        if (options.env) {
          baseUrl = options.env === "production" ? APP_URL : SANDBOX_URL;
        }

        var timestamp = moment().format("YYYYMMDDHHmmss");

        var sig = crypto.createHash("md5").update(this.accountSid + this.authToken + timestamp).digest("hex");
        var authorization = new Buffer("" + this.accountSid + ":" + timestamp).toString("base64");
        var apiUrl = "" + baseUrl + "/2013-12-26/Accounts/" + this.accountSid + "/SMS/TemplateSMS?sig=" + sig;

        // BUG: if body is object, the datas order is not guaranteed
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