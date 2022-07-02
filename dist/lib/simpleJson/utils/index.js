'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const typeOf = (obj) => {
  const { toString } = Object.prototype;
  const map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  return map[toString.call(obj)];
};
const _UUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
const deepAnalysisJson = (json) => {
  const jsonResult = [];
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (typeOf(json[key]) === "object") {
        const item = deepAnalysisJson(json[key]);
        const jsonItem = {
          id: _UUID(),
          key,
          value: item,
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      } else if (typeOf(json[key]) === "array") {
        const arr = [];
        json[key].forEach((x, index) => {
          if (typeOf(x) === "object") {
            const item = deepAnalysisJson(x);
            const jsonItem2 = {
              id: _UUID(),
              key: index,
              value: item,
              type: typeOf(x)
            };
            arr.push(jsonItem2);
          } else if (typeOf(x) === "array") {
            x.forEach((val) => {
              const item = deepAnalysisJson(val);
              const jsonItem2 = {
                id: _UUID(),
                key: index,
                value: item,
                type: typeOf(val)
              };
              arr.push(jsonItem2);
            });
          } else {
            const jsonItem2 = {
              id: _UUID(),
              key: index,
              value: x,
              type: typeOf(x)
            };
            arr.push(jsonItem2);
          }
        });
        const jsonItem = {
          id: _UUID(),
          key,
          value: arr,
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      } else {
        const jsonItem = {
          id: _UUID(),
          key,
          value: json[key],
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      }
    }
  }
  return jsonResult;
};
const deepReductionJson = (json) => {
  const jsonResult = {};
  json.forEach((x) => {
    if (x.type === "array") {
      const item = [];
      x.value.forEach((val) => {
        if (val.type === "object") {
          item.push(deepReductionJson(val.value));
        } else if (val.type === "array") {
          item.push(deepReductionJson(val.value));
        } else {
          item.push(val.value);
        }
      });
      jsonResult[x.key] = item;
    } else if (x.type === "object") {
      const item = {};
      x.value.forEach((val) => {
        if (val.type === "object") {
          item[val.key] = deepReductionJson(val.value);
        } else if (val.type === "array") {
          const arr = [];
          val.value.forEach((value, index) => {
            if (value.type === "object" || value.type === "array") {
              arr[index] = deepReductionJson(value.value);
            } else {
              arr[index] = value.value;
            }
          });
          item[val.key] = arr;
        } else {
          item[val.key] = val.value;
        }
      });
      jsonResult[x.key] = item;
    } else {
      jsonResult[x.key] = x.value;
    }
  });
  return jsonResult;
};
const deepDeleteJson = (json, tempId) => {
  if (json.type === "array" || json.type === "object") {
    for (let i = 0; i < json.value.length; i++) {
      deepDeleteJson(json.value[i], tempId);
      if (json.value[i].id === tempId) {
        json.value.splice(i, 1);
        updataArrIndex(json);
        i--;
      }
    }
  }
};
const updataArrIndex = (json) => {
  if (json.type === "array") {
    json.value.forEach((x, index) => {
      x.key = index;
    });
  }
};
const deepUpdataJson = (json, tempId, key, value) => {
  if (json.id === tempId) {
    json.key = key;
    json.value = value;
    return;
  }
  if (json.type === "array" || json.type === "object") {
    for (let i = 0; i < json.value.length; i++) {
      deepUpdataJson(json.value[i], tempId, key, value);
    }
  }
};
const mergeArray = (target, scoure) => {
  const rst = target.map((x) => {
    var _a, _b, _c;
    const configType = typeof x === "string";
    return {
      type: configType ? x : x.type,
      desc: configType ? findAllowType(x, scoure) : x.desc || ((_a = findAllowType(x.type, scoure)) == null ? void 0 : _a.desc),
      default: configType ? findAllowType(x, scoure) : x.default || ((_b = findAllowType(x.type, scoure)) == null ? void 0 : _b.default),
      slot: configType ? findAllowType(x, scoure) : x.slot || ((_c = findAllowType(x.type, scoure)) == null ? void 0 : _c.slot)
    };
  });
  return rst;
};
function findAllowType(type, scoure) {
  for (let i = 0; i < scoure.length; i++) {
    if (scoure[i].type === type) {
      return scoure[i];
    }
  }
}
const deepCopy = (data) => {
  const t = typeOf(data);
  let o;
  if (t === "array") {
    o = [];
  } else if (t === "object") {
    o = {};
  } else {
    return data;
  }
  if (t === "array") {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === "object") {
    Object.keys(data).forEach((key) => {
      o[key] = deepCopy(data[key]);
    });
  }
  return o;
};

exports._UUID = _UUID;
exports.deepAnalysisJson = deepAnalysisJson;
exports.deepCopy = deepCopy;
exports.deepDeleteJson = deepDeleteJson;
exports.deepReductionJson = deepReductionJson;
exports.deepUpdataJson = deepUpdataJson;
exports.mergeArray = mergeArray;
exports.typeOf = typeOf;
exports.updataArrIndex = updataArrIndex;
