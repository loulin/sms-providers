"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var request = _interopRequire(require("superagent"));

var apiUrl = "http://sms.1xinxi.cn/asmx/smsservice.aspx";

var TheFirst = (function () {
  function TheFirst(account, password) {
    _classCallCheck(this, TheFirst);

    this.account = account;
    this.password = password;
    this.name = "thefirst";
  }

  _createClass(TheFirst, {
    send: {
      value: function send(options, cb) {
        var data = {
          name: this.account,
          pwd: this.password,
          mobile: options.to,
          content: options.content,
          type: "pt"
        };
        request.post(apiUrl).type("form").send(data).end(function (res) {
          if (res.error) {
            var error = new Error("Request " + apiUrl + " error");
            error.status = res.status;
            return cb(error);
          }

          var result = res.text.split(",");
          if (result[0] !== "0") {
            var error = new Error(result[1]);
            error.status = parseInt(result[0], 10);
            error.raw = res.text;
            return cb(error);
          }

          return cb(null, res.text);
        });
      }
    }
  });

  return TheFirst;
})();

module.exports = TheFirst;
//# sourceMappingURL=thefirst.js.map