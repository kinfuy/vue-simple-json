import type { AllowTypeItem, JsonItem } from '../type/simple-json';

export const typeOf = (obj: any): string => {
  const { toString } = Object.prototype;
  const map: { [key: string]: string } = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  return map[toString.call(obj)];
};
export const _UUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 分析json，处理成jsonEditor需要的格式
 * @param json
 * @returns
 */
export const deepAnalysisJson = (
  json: Record<string, any>
): Array<JsonItem> => {
  const jsonResult = [];
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (typeOf(json[key]) === 'object') {
        const item = deepAnalysisJson(json[key]);
        const jsonItem = {
          id: _UUID(),
          key,
          value: item,
          type: typeOf(json[key]),
        };
        jsonResult.push(jsonItem);
      } else if (typeOf(json[key]) === 'array') {
        const arr: Array<JsonItem> = [];
        json[key].forEach((x: Record<string, any>, index: number) => {
          if (typeOf(x) === 'object') {
            const item = deepAnalysisJson(x);
            const jsonItem = {
              id: _UUID(),
              key: index,
              value: item,
              type: typeOf(x),
            };
            arr.push(jsonItem);
          } else if (typeOf(x) === 'array') {
            x.forEach((val: JsonItem) => {
              const item = deepAnalysisJson(val);
              const jsonItem = {
                id: _UUID(),
                key: index,
                value: item,
                type: typeOf(val),
              };
              arr.push(jsonItem);
            });
          } else {
            const jsonItem = {
              id: _UUID(),
              key: index,
              value: x,
              type: typeOf(x),
            };
            arr.push(jsonItem);
          }
        });
        const jsonItem = {
          id: _UUID(),
          key,
          value: arr,
          type: typeOf(json[key]),
        };
        jsonResult.push(jsonItem);
      } else {
        const jsonItem = {
          id: _UUID(),
          key,
          value: json[key],
          type: typeOf(json[key]),
        };
        jsonResult.push(jsonItem);
      }
    }
  }
  return jsonResult;
};

/**
 * 还原deepAnalysisJson处理的数据
 * @param json
 * @returns
 */
export const deepReductionJson = (json: Array<JsonItem>) => {
  const jsonResult: Record<string, any> | Record<string, any>[] = {};
  json.forEach((x) => {
    if (x.type === 'array') {
      const item: Array<Record<string | number, any>> = [];
      x.value.forEach((val: Record<string, any>) => {
        if (val.type === 'object') {
          item.push(deepReductionJson(val.value));
        } else if (val.type === 'array') {
          item.push(deepReductionJson(val.value));
        } else {
          item.push(val.value);
        }
      });
      jsonResult[x.key] = item;
    } else if (x.type === 'object') {
      const item: Record<string, any> = {};
      x.value.forEach((val: Record<string, any>) => {
        if (val.type === 'object') {
          item[val.key] = deepReductionJson(val.value);
        } else if (val.type === 'array') {
          const arr: Record<string | number, any>[] = [];
          val.value.forEach((value: JsonItem, index: number) => {
            if (value.type === 'object' || value.type === 'array') {
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
      (jsonResult as Record<string, any>)[x.key] = item;
    } else {
      (jsonResult as Record<string, any>)[x.key] = x.value;
    }
  });
  return jsonResult;
};

/**
 * 删除节点
 * @param json
 * @param tempId
 */
export const deepDeleteJson = (json: JsonItem, tempId: string) => {
  if (json.type === 'array' || json.type === 'object') {
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

// 更新当前数组序号
export const updataArrIndex = (json: JsonItem) => {
  if (json.type === 'array') {
    json.value.forEach((x: JsonItem, index: number) => {
      x.key = index;
    });
  }
};

/**
 * 更新节点
 * @param json
 * @param tempId
 * @param key
 * @param value
 * @returns
 */
export const deepUpdataJson = (
  json: JsonItem,
  tempId: string,
  key: string,
  value: any
) => {
  if (json.id === tempId) {
    json.key = key;
    json.value = value;
    return;
  }
  if (json.type === 'array' || json.type === 'object') {
    for (let i = 0; i < json.value.length; i++) {
      deepUpdataJson(json.value[i], tempId, key, value);
    }
  }
};

export const mergeArray = (
  target: Array<any>,
  scoure: Array<AllowTypeItem>
) => {
  const rst = target.map((x) => {
    const configType = typeof x === 'string';
    return {
      type: configType ? x : x.type,
      desc: configType
        ? findAllowType(x, scoure)
        : x.desc || findAllowType(x.type, scoure)?.desc,
      default: configType
        ? findAllowType(x, scoure)
        : x.default || findAllowType(x.type, scoure)?.default,
      slot: configType
        ? findAllowType(x, scoure)
        : x.slot || findAllowType(x.type, scoure)?.slot,
    };
  });
  return rst;
};
/**
 * 寻找AllowType
 * @param type
 * @param scoure
 * @returns
 */
function findAllowType(type: string, scoure: Array<AllowTypeItem>) {
  for (let i = 0; i < scoure.length; i++) {
    if (scoure[i].type === type) {
      return scoure[i];
    }
  }
}

// deepCopy
export const deepCopy = (data: any) => {
  const t = typeOf(data);
  let o: any;

  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === 'object') {
    Object.keys(data).forEach((key) => {
      o[key] = deepCopy(data[key]);
    });
  }
  return o;
};
