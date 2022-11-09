export type lineType = 'line' | 'array' | 'object';
export interface LineTarget {
  parent: LineTarget | null;
  type: 'line' | 'array' | 'object';
  key: string | number;
  value?: string | number | boolean;
  valueType: string;
  children: LineTarget[];
  level: number;
  isRoot: boolean;
  isExtend: boolean;
  lineError: string;
  validate: () => void;
  error: (tips: string) => void;
  clearError: () => void;
  extend: () => void;
  insert: () => void;
  remove: () => void;
  update: (type: 'key' | 'value' | 'type', value: any) => void;
  updateChildren: () => void;
}

export interface LineOptions {
  type: lineType;
  key: string | number;
  level: number;
  value?: any;
  isExtend?: boolean;
}
export class Line implements LineTarget {
  parent: LineTarget | null = null;

  type: lineType;

  key: string | number;

  isExtend = true;

  isRoot = false;

  value?: string | number | boolean | undefined;

  children: LineTarget[] = [];

  level: number;

  lineError = '';

  valueType: string;

  constructor(options: LineOptions, parent?: LineTarget) {
    this.parent = parent || null;
    this.type = options.type;
    this.key = options.key;
    this.level = options.level;
    this.value = options.value;
    this.valueType = typeof options.value;
    this.isRoot = !parent;
  }

  extend() {
    this.isExtend = !this.isExtend;
  }

  insert() {
    const key = this.type === 'object' ? 'newKey' : this.children.length;
    const newLine = new Line(
      { type: 'line', key, value: 'newValue', level: this.level + 1 },
      this || undefined
    );
    const index = this.children.indexOf(newLine);

    const isExit = this.children.some(
      (x) =>
        x.key === newLine.key &&
        x.level === newLine.level &&
        x.value === newLine.value
    );

    if (index > -1 || isExit) {
      newLine.error('不允许相同的key');
    }
    this.children.push(newLine);

    if (this.type === 'array') {
      this.updateChildren();
    }
  }

  remove() {
    if (this.parent) {
      const index = this.parent.children!.indexOf(this);
      if (index > -1) {
        this.parent.children.splice(index, 1);
      }
      this.parent.updateChildren();
    }
  }

  error(tips: string) {
    this.lineError = tips;
  }

  clearError() {
    this.lineError = '';
  }

  updateChildren() {
    this.children.forEach((x, i) => {
      const isError = this.children
        .filter((line) => line !== x)
        .some((line) => line.key === x.key);
      if (this.type === 'array') x.key = i;
      x.lineError = isError ? '不允许出现重复的key' : '';
    });
  }

  // updateKey() {}

  // updateValue() {}

  // updateType() {}

  validate() {}

  update(type: 'key' | 'value' | 'type', value: any) {
    if (type === 'key') {
      const validateKey = /^[a-zA-Z\\$_][a-zA-Z\d_]*$/;
      if (!validateKey.test(value)) {
        this.error('key不合法');
        return;
      }
      if (
        !this.parent ||
        this.parent.children
          .filter((x) => x !== this)
          .some((x) => x.key === value)
      ) {
        this.error('不能出现重复的key');
        return;
      }
      this.key = value;
      this.clearError();
      return;
    }
    if (type === 'value') {
      // TODO 验证数据类型
      this.value = value;
    }

    if (type === 'type') {
      if (['object', 'array'].includes(value)) this.type = value;
      else {
        this.type = 'line';
        this.valueType = value;
      }
    }
  }
}
