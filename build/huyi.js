"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var request = _interopRequire(require("superagent"));

var parseString = require("xml2js").parseString;

var apiUrl = "http://106.ihuyi.cn/webservice/sms.php?method=Submit";

var HuYi = (function () {
  function HuYi(account, password) {
    _classCallCheck(this, HuYi);

    this.account = account;
    this.password = password;
    this.name = "huyi";
  }

  _createClass(HuYi, {
    send: {
      value: function send(options, cb) {
        var data = {
          account: this.account,
          password: this.password,
          mobile: options.to,
          content: options.content
        };
        return request.post(apiUrl).type("form").send(data).end(function (res) {
          if (res.error) {
            var error = new Error("Request " + apiUrl + " error");
            error.status = res.status;
            return cb(error);
          }

          parseString(res.text, {
            explicitRoot: false,
            explicitArray: false
          }, function (err, result) {
            if (err) {
              return cb(err);
            }

            if (result.code !== "2") {
              var error = new Error(result.msg);
              error.status = parseInt(result.code, 10);
              error.raw = res.text;
              return cb(error);
            }

            return cb(null, res.text);
          });
        });
      }
    }
  });

  return HuYi;
})();

module.exports = HuYi;
//# sourceMappingURL=huyi.js.map