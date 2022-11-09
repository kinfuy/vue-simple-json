import { ref } from 'vue';
import { Line } from './line';
import type { LineTarget } from './line';

export class JsonEditor {
  private _lineRoot = ref<LineTarget>();

  get lineRoot() {
    return this._lineRoot.value;
  }

  get json() {
    return this.export();
  }

  constructor(json: Record<string, any>) {
    this.import(json);
  }

  export() {
    if (this._lineRoot.value)
      return this.deepReducetionJson([this._lineRoot.value]).__root__;
    return {};
  }

  import(json: Record<string, any>) {
    this._lineRoot.value = new Line({
      type: 'object',
      key: '__root__',
      level: 0,
    });
    this._lineRoot.value.children = this.isObjectLine(
      json,
      this._lineRoot.value
    );
  }

  private isObjectLine(obj: Record<string, any>, parent: Line) {
    const line: Line[] = [];
    const objKeys = Object.keys(obj);
    for (let i = 0; i < objKeys.length; i++) {
      if (typeOf(obj[objKeys[i]]) === 'object') {
        const objectLine = new Line(
          { type: 'object', key: objKeys[i], level: parent.level + 1 },
          parent
        );
        objectLine.children = this.isObjectLine(obj[objKeys[i]], objectLine);
        line.push(objectLine);
      } else if (typeOf(obj[objKeys[i]]) === 'array') {
        const arrayLine = new Line(
          { type: 'array', key: objKeys[i], level: parent.level + 1 },
          parent
        );
        arrayLine.children = this.isArrayLine(obj[objKeys[i]], arrayLine);
        line.push(arrayLine);
      } else {
        line.push(
          new Line(
            {
              type: 'line',
              key: objKeys[i],
              value: obj[objKeys[i]],
              level: parent.level + 1,
            },
            parent
          )
        );
      }
    }
    return line;
  }

  private isArrayLine(list: any[], parent: Line) {
    const line: Line[] = [];
    for (let i = 0; i < list.length; i++) {
      if (typeOf(list[i]) === 'object') {
        const objectLine = new Line(
          { type: 'object', key: i, level: parent.level + 1 },
          parent
        );
        objectLine.children = this.isObjectLine(list[i], objectLine);
        line.push(objectLine);
      } else if (typeOf(list[i]) === 'array') {
        const objectLine = new Line(
          { type: 'array', key: i, level: parent.level + 1 },
          parent
        );
        objectLine.children = this.isObjectLine(list[i], objectLine);
        line.push(objectLine);
      } else {
        line.push(
          new Line({
            type: 'line',
            key: i,
            value: list[i],
            level: parent.level + 1,
          }),
          parent
        );
      }
    }

    return line;
  }

  private deepReducetionJson(json: LineTarget[]) {
    const jsonResult: Record<string, any> | Record<string, any>[] = {};
    json.forEach((x) => {
      if (x.type === 'array') {
        const item: Array<Record<string | number, any>> = [];
        x.children.forEach((val: Record<string, any>) => {
          if (val.type === 'object') {
            item.push(this.deepReducetionJson(val.children));
          } else if (val.type === 'array') {
            item.push(this.deepReducetionJson(val.children));
          } else {
            item.push(val.value);
          }
        });
        jsonResult[x.key] = item;
      } else if (x.type === 'object') {
        const item: Record<string, any> = {};
        x.children.forEach((val: Record<string, any>) => {
          if (val.type === 'object') {
            item[val.key] = this.deepReducetionJson(val.children);
          } else if (val.type === 'array') {
            const arr: any[] = [];
            val.children.forEach((value: LineTarget, index: number) => {
              if (value.type === 'object' || value.type === 'array') {
                arr[index] = this.deepReducetionJson(value.children);
              } else {
                arr[index] = value.value!;
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
  }
}

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
