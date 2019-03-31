// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/peekable.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Peekable =
/** @class */
function () {
  function Peekable(iterator) {
    this.iterator = iterator;
  }

  Peekable.prototype.peek = function () {
    if (this.item) return this.item;
    this.item = this.iterator.next();
    return this.item;
  };

  Peekable.prototype.eof = function () {
    var item = this.peek();
    return item && item.done;
  };

  Peekable.prototype.next = function () {
    if (this.item) {
      var item = this.item;
      this.item = null;
      return item;
    }

    return this.iterator.next();
  };

  Peekable.prototype[Symbol.iterator] = function () {
    return this;
  };

  return Peekable;
}();

exports.Peekable = Peekable;
},{}],"src/charStream.ts":[function(require,module,exports) {
"use strict";

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var CharStream =
/** @class */
function () {
  function CharStream(input) {
    this.input = input;
    this.pos = 0;
    this.col = 0;
    this.line = 1;
  }

  CharStream.prototype.stream = function () {
    var _i, _a, ch;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _i = 0, _a = this.input;
          _b.label = 1;

        case 1:
          if (!(_i < _a.length)) return [3
          /*break*/
          , 4];
          ch = _a[_i];

          if (ch === "\n") {
            this.col = 0;
            this.line += 1;
          } else {
            this.col += 1;
          }

          this.pos += 1;
          return [4
          /*yield*/
          , ch];

        case 2:
          _b.sent();

          _b.label = 3;

        case 3:
          _i++;
          return [3
          /*break*/
          , 1];

        case 4:
          return [2
          /*return*/
          ];
      }
    });
  };

  CharStream.prototype.peek = function () {
    return this.input.charAt(this.pos);
  };

  CharStream.prototype.error = function (s) {
    throw Error("Error: " + s + " at line: " + this.line + " col: " + this.col);
  };

  return CharStream;
}();

exports.CharStream = CharStream;
},{}],"src/operator.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var BinaryOp;

(function (BinaryOp) {
  BinaryOp["Eq"] = "==";
  BinaryOp["NotEq"] = "!=";
  BinaryOp["Plus"] = "+";
  BinaryOp["Minus"] = "-";
  BinaryOp["Mul"] = "*";
  BinaryOp["Div"] = "/";
  BinaryOp["Power"] = "^";
  BinaryOp["GT"] = ">";
  BinaryOp["GTE"] = ">=";
  BinaryOp["LT"] = "<";
  BinaryOp["LTE"] = "<=";
})(BinaryOp = exports.BinaryOp || (exports.BinaryOp = {}));

exports.BINARYOPS = [BinaryOp.Eq, BinaryOp.NotEq, BinaryOp.Plus, BinaryOp.Minus, BinaryOp.Mul, BinaryOp.Div, BinaryOp.Power, BinaryOp.GT, BinaryOp.GTE, BinaryOp.LT, BinaryOp.LTE].map(function (x) {
  return x.toString();
});
exports.OPS = Array.from(new Set(exports.BINARYOPS.join("").split("")));
},{}],"src/tokenStream.ts":[function(require,module,exports) {
"use strict";

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var charStream_1 = require("./charStream");

var operator_1 = require("./operator");

var TokenType;

(function (TokenType) {
  TokenType["Punc"] = "PUNC";
  TokenType["Num"] = "NUM";
  TokenType["Str"] = "STRING";
  TokenType["Var"] = "VAR";
  TokenType["Kw"] = "KW";
  TokenType["Op"] = "OP";
})(TokenType = exports.TokenType || (exports.TokenType = {}));

var WHITESPACE = [" ", "\n", "\t"];
var ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
var NUMBER = "1234567890".split("");
var VARSTART = ALPHABET.concat(["_"]);
var IDENTIFIER = VARSTART.concat(NUMBER);
var PUNCT = "{}[]();:,".split("");
var COMMENT = ["#"];
var KEYWORDS = ["if", "then", "else", "lambda", "true", "false"];

var includes = function includes() {
  var chars = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    chars[_i] = arguments[_i];
  }

  return function (c) {
    return chars.indexOf(c) >= 0;
  };
};

var excludes = function excludes() {
  var chars = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    chars[_i] = arguments[_i];
  }

  return function (c) {
    return !includes.apply(void 0, chars)(c);
  };
};

var isPunctuation = includes.apply(void 0, PUNCT);
var isWhitespace = includes.apply(void 0, WHITESPACE);
var isIdentifier = includes.apply(void 0, IDENTIFIER);
var isAlphabet = includes.apply(void 0, ALPHABET);
var isVarstart = includes.apply(void 0, VARSTART);
var isNumber = includes.apply(void 0, NUMBER);
var isOperator = includes.apply(void 0, operator_1.OPS);
var isAssign = includes("=");
var isBinaryOperator = includes.apply(void 0, operator_1.BINARYOPS);
var isQuote = includes('"');
var isComment = includes.apply(void 0, COMMENT);
var isKeword = includes.apply(void 0, KEYWORDS);

var TokenStream =
/** @class */
function () {
  function TokenStream(input) {
    var _this = this;

    this.input = input;

    this.error = function (s) {
      return _this.charStream.error(s);
    };

    this.charStream = new charStream_1.CharStream(input);
    this.charIterator = this.charStream.stream();
  }

  TokenStream.prototype.takeWhile = function () {
    var chars = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      chars[_i] = arguments[_i];
    }

    var isIn = includes.apply(void 0, chars);
    var str = "";

    while (isIn(this.charStream.peek())) {
      str += this.charIterator.next().value;
    }

    return str;
  };

  TokenStream.prototype.takeUntil = function () {
    var chars = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      chars[_i] = arguments[_i];
    }

    var notIn = excludes.apply(void 0, chars);
    var str = "";

    while (notIn(this.charStream.peek())) {
      str += this.charIterator.next().value;
    }

    return str;
  };

  TokenStream.prototype.skipWhitespace = function () {
    this.takeWhile.apply(this, WHITESPACE);
  };

  TokenStream.prototype.skipLineRemainder = function () {
    this.takeUntil("\n");
  };

  TokenStream.prototype.takeAsString = function () {
    this.charIterator.next(); //skip quote

    var str = this.takeUntil('"', "\n");
    var q = this.charIterator.next(); //skip quote

    if (!isQuote(q.value)) this.error("Unterminated string");
    return str.replace(/\"/g, "");
  };

  TokenStream.prototype.takeAsOperator = function () {
    var op = this.takeWhile.apply(this, operator_1.OPS);

    if (!isBinaryOperator(op) && !isAssign(op)) {
      this.error("Unknown operator " + op);
    }

    return op;
  };

  TokenStream.prototype.takeAsIdentifier = function () {
    return this.takeWhile.apply(this, IDENTIFIER);
  };

  TokenStream.prototype.takeAsNumber = function () {
    var num = this.takeWhile.apply(this, NUMBER);
    var next = this.charStream.peek();

    if (isVarstart(next)) {
      this.error("Unknown token " + num + next + "..");
    }

    return Number(num);
  };

  TokenStream.prototype.stream = function () {
    var char, identifier;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!(char = this.charStream.peek())) return [3
          /*break*/
          , 17];
          if (!isComment(char)) return [3
          /*break*/
          , 1];
          this.skipLineRemainder();
          return [3
          /*break*/
          , 16];

        case 1:
          if (!isWhitespace(char)) return [3
          /*break*/
          , 2];
          this.skipWhitespace();
          return [3
          /*break*/
          , 16];

        case 2:
          if (!isPunctuation(char)) return [3
          /*break*/
          , 4];
          return [4
          /*yield*/
          , {
            type: TokenType.Punc,
            value: this.charIterator.next().value
          }];

        case 3:
          _a.sent();

          return [3
          /*break*/
          , 16];

        case 4:
          if (!isNumber(char)) return [3
          /*break*/
          , 6];
          return [4
          /*yield*/
          , {
            type: TokenType.Num,
            value: this.takeAsNumber()
          }];

        case 5:
          _a.sent();

          return [3
          /*break*/
          , 16];

        case 6:
          if (!isQuote(char)) return [3
          /*break*/
          , 8];
          return [4
          /*yield*/
          , {
            type: TokenType.Str,
            value: this.takeAsString()
          }];

        case 7:
          _a.sent();

          return [3
          /*break*/
          , 16];

        case 8:
          if (!isOperator(char)) return [3
          /*break*/
          , 10];
          return [4
          /*yield*/
          , {
            type: TokenType.Op,
            value: this.takeAsOperator()
          }];

        case 9:
          _a.sent();

          return [3
          /*break*/
          , 16];

        case 10:
          if (!isVarstart(char)) return [3
          /*break*/
          , 15];
          identifier = this.takeAsIdentifier();
          if (!isKeword(identifier)) return [3
          /*break*/
          , 12];
          return [4
          /*yield*/
          , {
            type: TokenType.Kw,
            value: identifier
          }];

        case 11:
          _a.sent();

          return [3
          /*break*/
          , 14];

        case 12:
          return [4
          /*yield*/
          , {
            type: TokenType.Var,
            value: identifier
          }];

        case 13:
          _a.sent();

          _a.label = 14;

        case 14:
          return [3
          /*break*/
          , 16];

        case 15:
          this.error("Unknown token " + char);
          _a.label = 16;

        case 16:
          return [3
          /*break*/
          , 0];

        case 17:
          return [2
          /*return*/
          ];
      }
    });
  };

  return TokenStream;
}();

exports.TokenStream = TokenStream;
},{"./charStream":"src/charStream.ts","./operator":"src/operator.ts"}],"src/parser.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var peekable_1 = require("./peekable");

var tokenStream_1 = require("./tokenStream");

var AstNode;

(function (AstNode) {
  AstNode["Num"] = "Num";
  AstNode["Str"] = "Str";
  AstNode["Bool"] = "Bool";
  AstNode["Var"] = "Var";
  AstNode["Lambda"] = "Lambda";
  AstNode["Call"] = "Call";
  AstNode["If"] = "If";
  AstNode["Assign"] = "Assign";
  AstNode["Binary"] = "Binary";
  AstNode["Prog"] = "Prog";
})(AstNode || (AstNode = {}));

var isTokenType = function isTokenType(tokenType) {
  return function (token) {
    return tokenType === token.type;
  };
};

var isTokenVal = function isTokenVal(value) {
  return function (token) {
    return value === token.value;
  };
};

var isToken = function isToken(tokenType) {
  return function (value) {
    return function (token) {
      return isTokenType(tokenType)(token) && isTokenVal(value)(token);
    };
  };
};

var isOp = isTokenType(tokenStream_1.TokenType.Op);
var isPunc = isTokenType(tokenStream_1.TokenType.Punc);
var isSemicol = isToken(tokenStream_1.TokenType.Punc)(";");
var isOpenParen = isToken(tokenStream_1.TokenType.Punc)("(");
var isCloseParen = isToken(tokenStream_1.TokenType.Punc)(")");
var isOpenCurly = isToken(tokenStream_1.TokenType.Punc)("{");
var isCloseCurly = isToken(tokenStream_1.TokenType.Punc)("}");
var isVar = isTokenType(tokenStream_1.TokenType.Var);
var isString = isTokenType(tokenStream_1.TokenType.Str);
var isNum = isTokenType(tokenStream_1.TokenType.Num);
var isIf = isToken(tokenStream_1.TokenType.Kw)("if");
var isLambda = isToken(tokenStream_1.TokenType.Kw)("lambda");
var isTrue = isToken(tokenStream_1.TokenType.Kw)("true");
var isFalse = isToken(tokenStream_1.TokenType.Kw)("false");
exports.isAssign = isToken(tokenStream_1.TokenType.Op)("=");

var Parser =
/** @class */
function () {
  function Parser(input) {
    var _this = this;

    this.parseNum = function (value) {
      return {
        type: AstNode.Num,
        value: value
      };
    };

    this.parseStr = function (value) {
      return {
        type: AstNode.Str,
        value: value
      };
    };

    this.parseVar = function (value) {
      return {
        type: AstNode.Var,
        value: value
      };
    };

    this.parseBool = function (value) {
      return {
        type: AstNode.Bool,
        value: value
      };
    };

    this.parseVarName = function () {
      var peek = _this.peek();

      if (isVar(peek)) {
        var val = _this.next().value;

        return _this.parseVar(val);
      }

      _this.error(peek.value + " is not a variable name");
    };

    this.skipKw = function (val) {
      return _this.skipToken(tokenStream_1.TokenType.Kw, val);
    };

    this.skipIf = function () {
      return _this.skipKw("if");
    };

    this.skipLambda = function () {
      return _this.skipKw("lambda");
    };

    this.skipThen = function () {
      return _this.skipKw("then");
    };

    this.skipElse = function () {
      return _this.skipKw("else");
    };

    this.skipPunc = function (val) {
      return _this.skipToken(tokenStream_1.TokenType.Punc, val);
    };

    this.skipSemicol = function () {
      return _this.skipPunc(";");
    };

    this.skipCol = function () {
      return _this.skipPunc(":");
    };

    this.eof = function () {
      return _this.tokenStream.eof();
    };

    this.next = function () {
      return _this.tokenStream.next().value;
    };

    this.peek = function () {
      return _this.tokenStream.peek().value;
    };

    this.error = function (s) {
      return _this.rawTokenStream.error(s + " around \"" + _this.peek().value + "\"");
    };

    this.rawTokenStream = new tokenStream_1.TokenStream(input);
    this.tokenStream = new peekable_1.Peekable(this.rawTokenStream.stream());
  }

  Parser.prototype.parseItem = function () {
    var _this = this;

    var peek = this.peek();
    if (isIf(peek)) return this.parseIf(); // if (isOpenParen(peek)) return this.parseExpression();

    if (isOpenCurly(peek)) return this.parseProg();
    if (isLambda(peek)) return this.parseLambda();
    var next = this.next();
    if (isVar(next)) return this.maybeCall(function () {
      return _this.parseVar(next.value);
    });
    if (isFalse(next)) return this.parseBool(false);
    if (isTrue(next)) return this.parseBool(true);
    if (isString(next)) return this.parseStr(next.value);
    if (isNum(next)) return this.parseNum(next.value);
    this.error("Unexpected token \"" + next.value + "\"");
  };

  Parser.prototype.parseProg = function () {
    var _this = this;

    var body = this.delimited("{", "}", ";", function () {
      return _this.parseExpression();
    });

    if (body.length === 0) {
      return body[0];
    }

    return {
      type: AstNode.Prog,
      body: body
    };
  };

  Parser.prototype.parseLambda = function () {
    var _this = this;

    this.skipLambda();
    var vars = this.delimited("(", ")", ",", function () {
      return _this.parseVarName();
    });
    this.skipCol();
    var body = this.delimited("{", "}", ";", function () {
      return _this.parseExpression();
    });
    return {
      type: AstNode.Lambda,
      vars: vars,
      body: body
    };
  };

  Parser.prototype.parseIf = function () {
    this.skipIf();
    var cond = this.parseExpression();
    this.skipThen();

    var _then = this.parseProg();

    this.skipElse();

    var _else = this.parseProg();

    return {
      type: AstNode.If,
      cond: cond,
      then: _then,
      "else": _else
    };
  };

  Parser.prototype.parseCall = function (func) {
    var _this = this;

    return {
      type: AstNode.Call,
      func: func,
      args: this.delimited("(", ")", ",", function () {
        return _this.parseExpression();
      })
    };
  };

  Parser.prototype.maybeCall = function (func) {
    var node = func();
    var next = this.peek();

    if (!this.eof() && isOpenParen(next)) {
      return this.parseCall(node);
    }

    return node;
  };

  Parser.prototype.maybeBinary = function (left) {
    var next = this.peek();

    if (!this.eof() && isOp(next)) {
      var op = this.next();
      var assign = exports.isAssign(op);
      var right = this.maybeBinary(this.parseItem());
      return assign ? {
        type: AstNode.Assign,
        op: "=",
        left: left,
        right: right
      } : {
        type: AstNode.Binary,
        op: op.value,
        left: left,
        right: right
      };
    }

    return left;
  };

  Parser.prototype.parseExpression = function () {
    var _this = this;

    return this.maybeCall(function () {
      return _this.maybeBinary(_this.parseItem());
    });
  };

  Parser.prototype.delimited = function (start, stop, sep, parser) {
    var isStop = isToken(tokenStream_1.TokenType.Punc)(stop);
    var ast = [];
    var first = true;
    this.skipPunc(start);

    while (!this.eof()) {
      if (isStop(this.peek())) {
        this.skipPunc(stop);
        break;
      }

      if (first) {
        first = false;
      } else {
        this.skipPunc(sep);
      }

      if (isStop(this.peek())) {
        this.skipPunc(stop);
        break;
      }

      ast.push(parser());
    }

    return ast;
  };

  Parser.prototype.parseTopLevel = function () {
    var body = [];

    while (!this.tokenStream.eof()) {
      body.push(this.parseExpression());

      if (!this.tokenStream.eof()) {
        this.skipSemicol();
      }
    }

    return {
      type: AstNode.Prog,
      body: body
    };
  };

  Parser.prototype.skipToken = function (type, val) {
    var token = this.next();
    var isCorrectToken = isToken(type)(val);
    if (!isCorrectToken(token)) this.error(val + " expected");
  };

  return Parser;
}();

exports.Parser = Parser;
},{"./peekable":"src/peekable.ts","./tokenStream":"src/tokenStream.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var parser_1 = require("./parser");

var tokenStream_1 = require("./tokenStream");

var input = "\n  sum = lambda (a,b): {a+b;};\n  mul = lambda (a,b): {a*b;};\n  sum(mul(2,3),5*2);\n";

var tokenResult = function tokenResult() {
  try {
    var ts = new tokenStream_1.TokenStream(input);
    var tokens = Array.from(ts.stream());
    return tokens;
  } catch (e) {
    return e.message;
  }
};

var parserResult = function parserResult() {
  try {
    var parser = new parser_1.Parser(input);
    return parser.parseTopLevel();
  } catch (e) {
    return e.message;
  }
};

document.getElementById("app").innerHTML = "\n" + JSON.stringify(parserResult(), null, 2) + "\n";
},{"./parser":"src/parser.ts","./tokenStream":"src/tokenStream.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61024" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map