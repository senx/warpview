/*
 *  Copyright 2019 SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// adapted from Canop's JSON,parseMore https://github.com/Canop/JSON.parseMore/
export class JsonLib {
  at;	 // The index of the current character
  ch;	 // The current character
  escapee = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
  };
  text;

  private error(m) {
    throw {
      name: 'SyntaxError',
      message: m,
      at: this.at,
      text: this.text
    };
  }

  private next() {
    return this.ch = this.text.charAt(this.at++);
  }

  private check(c) {
    if (c !== this.ch) {
      this.error('Expected \'' + c + '\' instead of \'' + this.ch + '\'');
    }
    this.ch = this.text.charAt(this.at++);
  }

  private number() {
    let string = '';
    if (this.ch === '-') {
      string = '-';
      this.check('-');
    }
    if (this.ch === 'I') {
      this.check('I');
      this.check('n');
      this.check('f');
      this.check('i');
      this.check('n');
      this.check('i');
      this.check('t');
      this.check('y');
      return -Infinity;
    }
    while (this.ch >= '0' && this.ch <= '9') {
      string += this.ch;
      this.next();
    }
    if (this.ch === '.') {
      string += '.';
      while (this.next() && this.ch >= '0' && this.ch <= '9') {
        string += this.ch;
      }
    }
    if (this.ch === 'e' || this.ch === 'E') {
      string += this.ch;
      this.next();
      if (this.ch === '-' || this.ch === '+') {
        string += this.ch;
        this.next();
      }
      while (this.ch >= '0' && this.ch <= '9') {
        string += this.ch;
        this.next();
      }
    }
    return +string;
  }

  private string() {
    let hex;
    let string = '';
    let uffff;
    if (this.ch === '"') {
      while (this.next()) {
        if (this.ch === '"') {
          this.next();
          return string;
        }
        if (this.ch === '\\') {
          this.next();
          if (this.ch === 'u') {
            uffff = 0;
            for (let i = 0; i < 4; i++) {
              hex = parseInt(this.next(), 16);
              if (!isFinite(hex)) {
                break;
              }
              uffff = uffff * 16 + hex;
            }
            string += String.fromCharCode(uffff);
          } else if (this.escapee[this.ch]) {
            string += this.escapee[this.ch];
          } else {
            break;
          }
        } else {
          string += this.ch;
        }
      }
    }
    this.error('Bad string');
  }

  private white() { // Skip whitespace.
    while (this.ch && this.ch <= ' ') {
      this.next();
    }
  }

  private word() {
    switch (this.ch) {
      case 't':
        this.check('t');
        this.check('r');
        this.check('u');
        this.check('e');
        return true;
      case 'f':
        this.check('f');
        this.check('a');
        this.check('l');
        this.check('s');
        this.check('e');
        return false;
      case 'n':
        this.check('n');
        this.check('u');
        this.check('l');
        this.check('l');
        return null;
      case 'N':
        this.check('N');
        this.check('a');
        this.check('N');
        return NaN;
      case 'I':
        this.check('I');
        this.check('n');
        this.check('f');
        this.check('i');
        this.check('n');
        this.check('i');
        this.check('t');
        this.check('y');
        return Infinity;
    }
    this.error('Unexpected \'' + this.ch + '\'');
  }

  private array() {
    const array = [];
    if (this.ch === '[') {
      this.check('[');
      this.white();
      if (this.ch === ']') {
        this.check(']');
        return array;   // empty array
      }
      while (this.ch) {
        array.push(this.value());
        this.white();
        if (this.ch === ']') {
          this.check(']');
          return array;
        }
        this.check(',');
        this.white();
      }
    }
    this.error('Bad array');
  }

  private object() {
    let key;
    const object = {};
    if (this.ch === '{') {
      this.check('{');
      this.white();
      if (this.ch === '}') {
        this.check('}');
        return object;   // empty object
      }
      while (this.ch) {
        key = this.string();
        this.white();
        this.check(':');
        if (Object.hasOwnProperty.call(object, key)) {
          this.error('Duplicate key "' + key + '"');
        }
        object[key] = this.value();
        this.white();
        if (this.ch === '}') {
          this.check('}');
          return object;
        }
        this.check(',');
        this.white();
      }
    }
    this.error('Bad object');
  }

  private value() {
    this.white();
    switch (this.ch) {
      case '{':
        return this.object();
      case '[':
        return this.array();
      case '"':
        return this.string();
      case '-':
        return this.number();
      default:
        return this.ch >= '0' && this.ch <= '9' ? this.number() : this.word();
    }
  }

  public parse(source, reviver) {
    let result;
    this.text = source;
    this.at = 0;
    this.ch = ' ';
    result = this.value();
    this.white();
    if (this.ch) {
      this.error('Syntax error');
    }
    return typeof reviver === 'function'
      ? (function walk(holder, key) {
        let k;
        let v;
        const value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }({'': result}, ''))
      : result;
  }
}
